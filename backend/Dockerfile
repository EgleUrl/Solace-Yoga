# Dockerfile for the backend service
# Use the official Python image from Docker Hub
# Defines how to build the Docker image for the backend service (pip install -r requirements.txt)

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /app/
