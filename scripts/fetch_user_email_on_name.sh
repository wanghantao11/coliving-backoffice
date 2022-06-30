#!/bin/bash

# README: before you run the script make sure the you have all envs set in ENV_SETUP as well as input

# ENV_SETUP
PG_HOST=
PG_USERNAME=
PG_DATABASE=
PG_PASSWORD=

# INPUT
# Example: userArray=('John Smith' 'Bai Li')
userArray=

# SCRIPT
for i in "${userArray[@]}"; do
    IFS=' '
    read -a fullName <<<"$i"

    lastName=${fullName[${#fullName[@]} - 1]}
    firstName=${fullName[@]:0:${#fullName[@]}-1}

    PGPASSWORD=$PG_PASSWORD psql -h $PG_HOST -U $PG_USERNAME $PG_DATABASE -c "SELECT first_name, last_name, email FROM public.user WHERE first_name = '$firstName' AND last_name = '$lastName'" -Xt
done
