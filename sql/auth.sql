-- findUser
SELECT * FROM users
  WHERE user_name = :username;

-- findUserByEmail
SELECT * FROM users
  WHERE email = :email;

-- checkPassword
SELECT * FROM users
  WHERE user_name = :username
    AND password = crypt(:password, password);

-- createUser
INSERT INTO users (user_name, email, password) VALUES
  (:username, :email, crypt(:password, gen_salt('bf', 8)))
  RETURNING *;