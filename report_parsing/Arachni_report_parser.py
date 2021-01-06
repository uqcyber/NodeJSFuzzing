# Copyright (c) 2020, 2020, Oracle and/or its affiliates.
# Contributor: Trong Nhan Mai

import json
import sys
import csv

def writeURLs(csvWriter, sitemap):
    """
    Write to the csv files the list of URLs in Arachni sitemap
    """
    csvWriter.writerow(["URL", "Return Code"])
    for key, value in sitemap.items():
        csvWriter.writerow([key, value])

def writeIssueList(csvWriter, issueList):
    """
    Write the issue list to the csv file
    """
    csvWriter.writerow(["Name", "Location", "Param", "Attack value", "Severity"])
    for issue in issueList:
        name = issue["name"]
        location = issue["vector"]["url"]
        param = None
        value = None
        try:
            param = issue["vector"]["affected_input_name"]
            value = issue["vector"]["affected_input_value"]
        except KeyError:
            pass
        severity = issue["severity"]
        csvWriter.writerow([name, location, param, value, severity])

def parseIt(input, output):
    jsonFile = open(input, "r")
    jsonObject = json.load(jsonFile)
    csvFile = open(output, "w")
    csvWriter = csv.writer(csvFile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

    issueList = jsonObject["issues"]
    sitemap = jsonObject["sitemap"]
    writeURLs(csvWriter, sitemap)

    csvWriter.writerow([])

    writeIssueList(csvWriter, issueList)
    csvFile.close()
    

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("USAGE: Arachni_report_parser.py [INPUT_FILE] [OUTPUT_FILE]")
    else:
        inputFileName = sys.argv[1]
        outputFileName = sys.argv[2]
        parseIt(inputFileName, outputFileName)