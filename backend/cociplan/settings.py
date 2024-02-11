"""
Django settings for cociplan project.

Generated by 'django-admin startproject' using Django 4.2.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

import os
from pathlib import Path

import sentry_sdk
from decouple import config
from django.db.models.query import QuerySet
from sentry_sdk.integrations.django import DjangoIntegration

# Set the project base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# False if not in os.environ because of casting above
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config("DEBUG", default=False, cast=bool)

current_dir = os.path.abspath(os.path.dirname(__file__))
path = Path(current_dir)
project_dir = path.parent.absolute().parent

# NOTE: there are probably other items you'll need to monkey patch depending on
# your version.
for cls in [QuerySet]:
    cls.__class_getitem__ = classmethod(lambda cls, *args, **kwargs: cls)


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# Raises Django's ImproperlyConfigured
# exception if SECRET_KEY not in os.environ
SECRET_KEY = config("SECRET_KEY")
ALLOWED_HOSTS = config(
    "ALLOWED_HOSTS", cast=lambda v: [s.strip() for s in v.split(",")]
)


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_filters",
    "rest_framework",
    "rest_framework.authtoken",
    "drf_yasg",
    "corsheaders",
    "menus",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        # 'rest_framework.authentication.TokenAuthentication',
    ],
    "DEFAULT_RENDERER_CLASSES": (
        "djangorestframework_camel_case.render.CamelCaseJSONRenderer",
        "djangorestframework_camel_case.render.CamelCaseBrowsableAPIRenderer",
        # Any other renders
    ),
    "DEFAULT_PARSER_CLASSES": (
        # If you use MultiPartFormParser or FormParser, we also have a camel case
        "djangorestframework_camel_case.parser.CamelCaseFormParser",
        "djangorestframework_camel_case.parser.CamelCaseMultiPartParser",
        "djangorestframework_camel_case.parser.CamelCaseJSONParser",
        # Any other parsers
    ),
    "JSON_UNDERSCOREIZE": {
        "no_underscore_before_number": True,
    },
}

ROOT_URLCONF = "cociplan.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "cociplan.wsgi.application"

DB_TYPE = config("DATABASE_TYPE")

SQLITE_DB_PATH = config("DATABASE_SQLITE_PATH", default="/usr/src/data/db.sqlite3")


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": SQLITE_DB_PATH,
    }
}
if DB_TYPE == "mysql":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.mysql",
            "NAME": config("DB_NAME", default="cociplan"),
            "USER": config("DB_USER", default="root"),
            "PASSWORD": config("DB_PASSWORD", default="example"),
            "HOST": config("DB_HOSTNAME", default="db"),
            "PORT": config("DB_PORT", default=3306, cast=int),
        }
    }
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",  # noqa
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = config("TIME_ZONE", default="UTC")

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "/static-files/"
STATIC_ROOT = "/app/static/"

MEDIA_URL = "/media/"
MEDIA_ROOT = config("MEDIA_ROOT")

SWAGGER_SETTINGS: dict = {}

LOG_LEVEL = config("LOG_LEVEL", default="INFO")
LOGS_ROOT = config("LOGS_ROOT")
LOGGER_HANDLERS = config(
    "LOGGER_HANDLERS", cast=lambda v: [s.strip() for s in v.split(",")]
)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "file": {
            "format": "{levelname} | {asctime} | {module}:{lineno} | {process:d} | {thread:d} | {message}",  # noqa
            "style": "{",
        },
        "console": {
            "format": "{levelname} | {asctime} | {message} | {pathname}:{lineno} | {module} | {funcName}",  # noqa
            "style": "{",
        },
    },
    "handlers": {
        "console": {"class": "logging.StreamHandler", "formatter": "console"},
        "file": {
            "level": "DEBUG",
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "file",
            "maxBytes": 15728640,  # 1024 * 1024 * 15B = 15MB
            "backupCount": 10,
            "filename": os.path.join(LOGS_ROOT, "debug.log"),  # type: ignore
        },
    },
    "loggers": {
        "*": {
            "handlers": LOGGER_HANDLERS,
            "level": "ERROR",
            "propagate": True,
        },
        "buho_backend": {
            "handlers": LOGGER_HANDLERS,
            "level": LOG_LEVEL,
            "propagate": True,
        },
    },
}

if config("ENABLE_SENTRY", default=False, cast=bool):
    sentry_sdk.init(
        dsn=config("SENTRY_DSN", default=""),  # type: ignore
        integrations=[
            DjangoIntegration(),
        ],
        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for performance monitoring.
        # We recommend adjusting this value in production.
        traces_sample_rate=1.0,
        # If you wish to associate users to errors (assuming you are using
        # django.contrib.auth) you may enable sending PII data.
        send_default_pii=True,
    )


CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS", cast=lambda v: [s.strip() for s in v.split(",")]
)
