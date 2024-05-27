FROM php:8.3.7-apache

RUN docker-php-ext-install mysqli && \
    docker-php-ext-install pdo_mysql && \
    php -m
