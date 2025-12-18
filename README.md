# Job Portal Application

A full-stack job portal application built with Django REST Framework and React.

## Features

### For Job Seekers
- Browse and search jobs with advanced filters
- Apply for jobs with cover letters
- Save jobs for later
- Track application status
- Personal dashboard

### For Employers
- Post and manage job listings
- Review applications
- Update application status
- Analytics dashboard

## Tech Stack

**Backend:**
- Django 4.2
- Django REST Framework
- JWT Authentication
- PostgreSQL

**Frontend:**
- React 18
- React Router v6
- Axios
- Tailwind CSS

## Local Setup

### Backend
```bash
# Clone repository
git clone https://github.com/Nikul30701/Job_Applicatipn-Django-React-
cd job-portal/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your settings

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with backend URL

# Run development server
npm start
```

## API Documentation

Base URL: `http://localhost:8000/api`

### Authentication
- POST `/auth/register/` - Register new user
- POST `/auth/login/` - Login user
- POST `/auth/token/refresh/` - Refresh access token

### Jobs
- GET `/jobs/` - List all jobs (with filters)
- GET `/jobs/{id}/` - Get job details
- POST `/jobs/employer/jobs/create/` - Create job (employer only)
- PATCH `/jobs/employer/jobs/{id}/update/` - Update job
- DELETE `/jobs/employer/jobs/{id}/delete/` - Delete job

### Applications
- POST `/jobs/applications/apply/` - Apply for job
- GET `/jobs/applications/my-applications/` - Get my applications
- GET `/jobs/employer/applications/` - Get applications (employer)


## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

MIT