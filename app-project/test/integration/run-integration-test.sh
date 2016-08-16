#!/bin/bash

TS=`date +%s`

for f in ./postman/*
do
    newman run "$f" | tee -a results_$TS.txt
done

echo ""
echo "-----------------------------------"
echo "Done test - results written to:  result_$TS.txt"
echo "-----------------------------------"
