import os
import logging
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
from gensim.summarization import summarize


#give the path of the input file below
input_file='/Users/swaminathan.b/Documents/conversation-text-summarizer/text.txt'
a=open(input_file,'r')
text=a.read()

#no need to change path for the next code
#delete this file from specified folder if you are not running it for the first time
try:
    os.remove('/Users/swaminathan.b/Documents/conversation-text-summarizer/singles.txt')
except:
    pass
c=open('/Users/swaminathan.b/Documents/conversation-text-summarizer/singles.txt','a+')

list_of_values1=([n for n in range(len(text)) if text.find(':', n) == n])
list_of_values1.append(len(text)+1)
list_of_values2=([n for n in range(len(text)) if text.find('\n', n) == n])
list_of_values2.append(len(text)+1)


start=0
for i in range(len(list_of_values2)):
    if i==(len(list_of_values2)-4):
        c.writelines(text[list_of_values2[i-1]:])
        break
    else:
         if len(text[(list_of_values1[i]):(list_of_values2[i])])>500:
            single_text=summarize(text[(list_of_values1[i]):(list_of_values2[i])],ratio=0.4)
            c.writelines(text[(start):(list_of_values1[i])]+": "+single_text +"\n")
            start=list_of_values2[i]
         else:
            single_text=(text[(list_of_values1[i]):(list_of_values2[i])])
            c.writelines(text[(start):(list_of_values1[i])]+single_text +"\n")
            start=list_of_values2[i]

c.close()

b=open('/Users/swaminathan.b/Documents/conversation-text-summarizer/singles.txt','r')
modified_text=b.read()

#adjust the percentage of summarisation  0<ratio<1
ratio=0.1
#give the path for output file in next line
output_file='/Users/swaminathan.b/Documents/conversation-text-summarizer/summary.txt'
sum=(summarize(modified_text,ratio=ratio))
b=open(output_file,'w')
b.write(sum)
os.remove('/Users/swaminathan.b/Documents/conversation-text-summarizer/singles.txt')