# Backend Setup Guide

## Installation

1. **Create a virtual environment:**
```bash
cd backend
python -m venv venv
```

2. **Activate the virtual environment:**

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Create .env file:**
```bash
cp .env.example .env
```

5. **Configure .env:**
Edit the `.env` file and change the `SECRET_KEY` to something secure:
```bash
SECRET_KEY=your-new-secret-key-here
```

## Running the Server

```bash
python main.py
```

The server will start at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Available Endpoints

### Authentication

#### POST `/api/ssh-connect`
Connect to an Ubuntu server via SSH and get JWT token.

**Request:**
```json
{
  "ipAddress": "192.168.1.100",
  "port": 22,
  "username": "ubuntu",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully connected and authenticated",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "ubuntu",
    "ip_address": "192.168.1.100",
    "port": 22
  }
}
```

#### POST `/api/logout`
Logout endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET `/api/verify-token`
Verify if a JWT token is valid.

**Query Parameters:**
- `token` (string): The JWT token to verify

**Response:**
```json
{
  "valid": true,
  "username": "ubuntu",
  "ip_address": "192.168.1.100"
}
```

#### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Security Notes

⚠️ **Important:**
- Never commit `.env` file with real secrets
- Change `SECRET_KEY` in production
- Use SSH keys instead of passwords when possible
- Enable HTTPS in production
- Keep dependencies updated: `pip install --upgrade -r requirements.txt`

## Troubleshooting

**Connection timeout:**
- Check if the server IP is correct
- Ensure the server is reachable
- Check firewall settings

**Authentication failed:**
- Verify username and password
- Check if the SSH port is correct
- Ensure the user has SSH access enabled

**JWT token errors:**
- Token may be expired
- Regenerate token by logging in again
