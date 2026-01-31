// src/controllers/pathController.js
const db = require('../config/database');
const { AppError, catchAsync } = require('../middleware/errorHandler');

// Initialize user's path (create default nodes)
const initializeUserPath = async (userId) => {
  const defaultNodes = [
    {
      node_id: 'awakening',
      title: 'THE AWAKENING',
      realm: 'Foundation',
      status: 'completed',
      description: 'You have entered the Imperium.',
      quests: JSON.stringify([
        { id: 'q1', title: 'Choose Your First Mentor', completed: true },
        { id: 'q2', title: 'Receive Your First Counsel', completed: true }
      ]),
      xp_reward: 100
    },
    {
      node_id: 'discipline',
      title: 'THE DISCIPLINE',
      realm: 'Foundation',
      status: 'active',
      description: 'Build the foundation of self-mastery.',
      quests: JSON.stringify([
        { id: 'q3', title: 'Complete 7 Day Streak', completed: false },
        { id: 'q4', title: 'Follow 5 Decrees', completed: false }
      ]),
      xp_reward: 200
    },
    {
      node_id: 'influence',
      title: 'THE INFLUENCE',
      realm: 'Ascension',
      status: 'locked',
      description: 'Learn to move others and shape outcomes.',
      quests: JSON.stringify([]),
      xp_reward: 300
    },
    {
      node_id: 'conquest',
      title: 'THE CONQUEST',
      realm: 'Ascension',
      status: 'locked',
      description: 'Take decisive action in the world.',
      quests: JSON.stringify([]),
      xp_reward: 400
    },
    {
      node_id: 'empire',
      title: 'THE EMPIRE',
      realm: 'Mastery',
      status: 'locked',
      description: 'Build your domain and legacy.',
      quests: JSON.stringify([]),
      xp_reward: 500
    }
  ];

  for (const node of defaultNodes) {
    await db.query(
      `INSERT IGNORE INTO path_nodes 
       (user_id, node_id, title, realm, status, description, quests, xp_reward) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, node.node_id, node.title, node.realm, node.status, node.description, node.quests, node.xp_reward]
    );
  }
};

// Get user's path progression
exports.getUserPath = catchAsync(async (req, res, next) => {
  // Check if user has path nodes, if not, initialize
  const [existing] = await db.query(
    'SELECT COUNT(*) as count FROM path_nodes WHERE user_id = ?',
    [req.userId]
  );

  if (existing[0].count === 0) {
    await initializeUserPath(req.userId);
  }

  // Get all path nodes
  const [nodes] = await db.query(
    'SELECT * FROM path_nodes WHERE user_id = ? ORDER BY id',
    [req.userId]
  );

  // Parse quests JSON
  nodes.forEach(node => {
    node.quests = JSON.parse(node.quests || '[]');
  });

  // Calculate progress
  const totalNodes = nodes.length;
  const completedNodes = nodes.filter(n => n.status === 'completed').length;
  const progress = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

  res.status(200).json({
    status: 'success',
    data: {
      nodes,
      progress,
      totalNodes,
      completedNodes,
      currentRealm: nodes.find(n => n.status === 'active')?.realm || 'Foundation'
    }
  });
});

// Get single path node
exports.getNode = catchAsync(async (req, res, next) => {
  const { nodeId } = req.params;

  const [nodes] = await db.query(
    'SELECT * FROM path_nodes WHERE user_id = ? AND node_id = ?',
    [req.userId, nodeId]
  );

  if (nodes.length === 0) {
    return next(new AppError('Path node not found', 404));
  }

  const node = nodes[0];
  node.quests = JSON.parse(node.quests || '[]');

  res.status(200).json({
    status: 'success',
    data: {
      node
    }
  });
});

// Update quest progress
exports.updateQuest = catchAsync(async (req, res, next) => {
  const { nodeId, questId } = req.params;
  const { completed } = req.body;

  // Get the node
  const [nodes] = await db.query(
    'SELECT * FROM path_nodes WHERE user_id = ? AND node_id = ?',
    [req.userId, nodeId]
  );

  if (nodes.length === 0) {
    return next(new AppError('Path node not found', 404));
  }

  const node = nodes[0];
  const quests = JSON.parse(node.quests || '[]');

  // Find and update quest
  const quest = quests.find(q => q.id === questId);
  if (!quest) {
    return next(new AppError('Quest not found', 404));
  }

  quest.completed = completed;

  // Check if all quests are completed
  const allCompleted = quests.every(q => q.completed);
  let newStatus = node.status;

  if (allCompleted && node.status === 'active') {
    newStatus = 'completed';
    
    // Award XP
    if (node.xp_reward) {
      const [users] = await db.query('SELECT xp, level FROM users WHERE id = ?', [req.userId]);
      const newXP = users[0].xp + node.xp_reward;
      const xpPerLevel = 1000;
      const newLevel = Math.floor(newXP / xpPerLevel) + 1;
      
      await db.query('UPDATE users SET xp = ?, level = ? WHERE id = ?', [newXP, newLevel, req.userId]);
    }

    // Unlock next node if exists
    const [nextNodes] = await db.query(
      'SELECT * FROM path_nodes WHERE user_id = ? AND status = "locked" ORDER BY id LIMIT 1',
      [req.userId]
    );

    if (nextNodes.length > 0) {
      await db.query(
        'UPDATE path_nodes SET status = "active" WHERE id = ?',
        [nextNodes[0].id]
      );
    }
  }

  // Update the node
  await db.query(
    'UPDATE path_nodes SET quests = ?, status = ? WHERE user_id = ? AND node_id = ?',
    [JSON.stringify(quests), newStatus, req.userId, nodeId]
  );

  // Get updated node
  const [updated] = await db.query(
    'SELECT * FROM path_nodes WHERE user_id = ? AND node_id = ?',
    [req.userId, nodeId]
  );

  const updatedNode = updated[0];
  updatedNode.quests = JSON.parse(updatedNode.quests || '[]');

  res.status(200).json({
    status: 'success',
    data: {
      node: updatedNode,
      nodeCompleted: allCompleted,
      xpAwarded: allCompleted ? node.xp_reward : 0
    }
  });
});

// Reset path (for testing)
exports.resetPath = catchAsync(async (req, res, next) => {
  await db.query('DELETE FROM path_nodes WHERE user_id = ?', [req.userId]);
  await initializeUserPath(req.userId);

  const [nodes] = await db.query(
    'SELECT * FROM path_nodes WHERE user_id = ? ORDER BY id',
    [req.userId]
  );

  nodes.forEach(node => {
    node.quests = JSON.parse(node.quests || '[]');
  });

  res.status(200).json({
    status: 'success',
    message: 'Path reset successfully',
    data: {
      nodes
    }
  });
});