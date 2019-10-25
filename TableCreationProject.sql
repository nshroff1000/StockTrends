CREATE TABLE Stocks(stock_id int(11), stock_name varchar(80), stock_ticker varchar(20), PRIMARY KEY(stock_id));

CREATE TABLE Trends(trend_id int(11), stock_id int(11), trend_value int(11), start_of_week date, PRIMARY KEY(trend_id), FOREIGN KEY (stock_id) REFERENCES Stocks(stock_id));

CREATE TABLE Prices(price_id int(11), stock_id int(11), volume int(25), daily_date date, price double(10, 2), PRIMARY KEY (price_id), FOREIGN KEY (stock_id) REFERENCES Stocks(stock_id));

