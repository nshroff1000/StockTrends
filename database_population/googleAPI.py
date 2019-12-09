from pytrends.request import TrendReq
import csv

pytrends = TrendReq(hl='en-US', tz=360)
with open('trends.csv', 'a') as prices_file:
    with open('s&p500_stocks.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        count = 1
        prices_writer = csv.writer(prices_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

        for row in csv_reader:
            # print(row[0])
            # print(row[1])
            print(row[2])

            ticker = row[1]
            stock_id = count
            count += 1
            if ticker == 'IBM':
                count+=1

            company_name = row[2]
            kw_list = [company_name]
            pytrends.build_payload(kw_list, cat=0, timeframe='today 5-y', geo='', gprop='')
            entries = pytrends.interest_over_time()
            for data in entries.index:
                date = str(data).split(" ")[0]
                print(date, entries.loc[date][company_name])
                prices_writer.writerow([company_name, stock_id, date, entries.loc[date][company_name]])
