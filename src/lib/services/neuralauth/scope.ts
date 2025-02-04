export const AUTH_SCHEMA = `
  DEFINE SCOPE user SESSION 24h
    SIGNUP (
      CREATE user 
      SET 
        username = $user,
        pass = crypto::argon2::generate($pass)
    )
    SIGNIN (
      SELECT * FROM user 
      WHERE 
        username = $user 
        AND crypto::argon2::compare(pass, $pass)
    );

  DEFINE TOKEN user_token ON DATABASE
    TYPE HS512
    VALUE $env.JWT_SECRET
    PERMISSIONS FOR select, create, update, delete WHERE id = $auth.id;
`; 