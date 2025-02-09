#!/bin/bash
turso db shell urulicotursodb < "./prisma/migrations/$1/migration.sql" 