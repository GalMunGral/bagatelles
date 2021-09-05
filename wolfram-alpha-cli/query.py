#!/usr/bin/env python3
import xml.etree.ElementTree as ET
from urllib.parse import urlencode
import requests
import sys
import io

NORMAL = '\033[0m'
BOLD = '\033[1m'
UNDERLINE = '\033[4m'
HOST_NAME = 'api.wolframalpha.com'
APP_ID = 'TPXWX3-PLV66PGRGY'
PATH_FROM_INPUT = lambda input: '/v2/query?' + urlencode(
  { 'input': input, 'appid': APP_ID }
)

def printContent(root):
  pods = root.findall('pod[@title]')
  for pod in pods:
    print(BOLD + UNDERLINE + pod.attrib['title'] + NORMAL)
    content = pod.findall('.//plaintext')
    for section in content:
      if section.text != None:
        print('  ' + section.text, end='\n\n')


if len(sys.argv) == 1:
  raise ValueError('No input provided')

full_url = 'https://' + HOST_NAME + PATH_FROM_INPUT(sys.argv[1])
res = requests.get(full_url)
if res.ok:
  root = ET.fromstring(res.text)
  printContent(root)

