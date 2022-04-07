import sys
import numpy as np
import pandas as pd

df = pd.read_excel(sys.argv[1],
                   skiprows=[1, 2],
                   usecols=[0, 1, 3],
                   index_col=[0, 1], # 以 (股票代码, 日期) 为索引
                   dtype={ 'Stkcd': 'string' }, 
                   parse_dates=['Trddt'])

print("输入:\n", df.dtypes, "\n\n", df, "\n\n")

# 以 (股票代码, 年份) 分组求平均值
avg = df.groupby(lambda idx: (idx[0], idx[1].year)).mean()

# 输出
index = list(avg.index.values)
avg['Stkcd'] = pd.Series([c for c, _ in index], dtype="string").values
avg['Trdyr'] = [y for _, y in index]


print("输出:\n", avg.dtypes, "\n\n", avg)

avg.to_excel('out.xlsx',
             index=False,
             columns=['Stkcd', 'Tolstknum', 'Trdyr'],
             header=['证券代码', '日均总成交量', '交易年份'])

