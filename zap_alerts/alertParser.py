# Copyright (c) 2020, 2020, Oracle and/or its affiliates.
# Contributor: Trong Nhan Mai

import json
import sys
import csv

def fix_alert_desc(desc):
    result = desc.replace("<p>", "")
    result = result.replace("</p>", "")
    return result

def parseIt(input, output):
    jsonFile = open(input, "r")
    jsonObject = json.load(jsonFile)

    csvFile = open(output, "w")

    alerts = jsonObject["site"][0]["alerts"]
    count = len(alerts)
    csvWriter = csv.writer(csvFile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

    if count > 0:
        for i in range(count):
            name = alerts[i]["name"]
            riskdesc = alerts[i]["riskdesc"]
            desc = fix_alert_desc(alerts[i]["desc"])
            alertCount = alerts[i]["count"]
            csvWriter.writerow([riskdesc, alertCount, name, desc])
    else:
        print("There are no alerts, WOW")
    

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("USAGE: alertParsert.py [INPUT_FILE] [OUTPUT_FILE]")
    else:
        inputFileName = sys.argv[1]
        outputFileName = sys.argv[2]
        parseIt(inputFileName, outputFileName)
