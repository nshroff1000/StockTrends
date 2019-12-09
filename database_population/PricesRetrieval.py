import requests
import sys
import csv
import json

print(sys.version)

check = False

with open('prices.csv', 'a') as prices_file:
    with open('s&p500_stocks.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        count = 1

        for row in csv_reader:
            # print(row[0])
            # print(row[1])
            # print(row[2])
            ticker = row[1]
            count += 1
            if not check:
                if ticker == 'XL':
                    check = True
                continue

            stock_id = count
            response = requests.get(
                "https://api.worldtradingdata.com/api/v1/history?symbol=" + ticker + "&"
                "sort=newest&api_token=jhZfevqwuFJxATIsUaneKkQHg6FSWAT6rFYHdBgVZnj1GN9SsMqBBco2ZzJd")
            information = response.text
            json_data = json.loads(response.text)
            company_name = json_data['name']
            historical_data = json_data['history']

            prices_writer = csv.writer(prices_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            for date in json_data['history']:
                print(json_data['history'][date]['close'])
                prices_writer.writerow([company_name, stock_id, date, json_data['history'][date]['close'], json_data['history'][date]['volume']])


