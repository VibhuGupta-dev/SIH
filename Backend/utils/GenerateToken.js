import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    Fullname: user.Fullname,
    isEmailVerified: user.isEmailVerified,
  };
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { 
      expiresIn: '1h',
      audience: 'mental-assessment-users',
      issuer: 'mental-assessment-api'
    }
  );
};

export default generateToken;
