from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

password = "password123"
password_hash = pwd_context.hash(password)

print(password_hash)