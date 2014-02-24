#!/bin/bash
#
# bash script to generate a copy of the given folder whilst converting all .doc* files to .html files
# requires from folder and destination folder as arguments
#
# Author: Tyler Hugenberg
# Date: 2/15/14
# Team: Clean And Sober Toolbox

if [ $# -eq 2 ] 
  then
    echo converting $1 $2

    # copy entire directory to new destination
    cp -r "$1" "$2/"

    # convert .doc files
    find "$2" -type f -name "*.doc*" | while read file; do
      textutil -convert txt "$file"
      rm "$file"
    done

    # escape double quotes in html files
    find "$2" -type f -name "*.txt" | while read file; do
      sed -ie 's/"/\\"/g' "$file"
    done

    # remove e files that get generated from string replace
    find "$2" -type f -name "*.txte" | while read file; do
      rm "$file"
    done

    echo files placed in $2/


else
  echo must supply to and from directory as arguments
fi


