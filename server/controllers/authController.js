const User = require('../models/User');

// POST /api/auth/google — sync Firebase user with MongoDB
exports.googleAuth = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const firebaseUid = req.user?.uid;

    if (!firebaseUid || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Upsert user: find by firebaseUid OR email, update or create
    let user = await User.findOneAndUpdate(
      { $or: [{ firebaseUid }, { email }] },
      {
        $set: {
          firebaseUid,
          name: name || email.split('@')[0],
          email,
          avatar: avatar || ''
        }
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/auth/me — get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      screeningsCount: user.screeningsCount,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
