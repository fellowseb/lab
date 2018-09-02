#! /bin/bash
#
# Adds the input files to a local S3 bucket, as keys.
#
set INPUT_FILES_PATT = "";
set S3_BUCKET = "";
set S3_DIRECTORY = "";
set OPT_CONTENT_TYPE_OVERR = "";

set input_files = find . -name INPUT_FILES_PATT
for [$fp in fin]
rof