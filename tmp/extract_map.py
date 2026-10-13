import urllib.request
import ast

url = 'https://raw.githubusercontent.com/indic-transliteration/indic_transliteration_py/master/indic_transliteration/font_converter/krutidev2unicode.py'
txt = urllib.request.urlopen(url).read().decode('utf-8')
k2u_str = txt[txt.index('k2u = ['):txt.index('unicode_vowel_signs = [')].strip()
pairs = ast.literal_eval(k2u_str[6:])

keys = "`1234567890-=~!@#$%^&*()_+qwertyuiop[]\\QWERTYUIOP{}|asdfghjkl;'ASDFGHJKL:\"zxcvbnm,./ZXCVBNM<>?"

for ch in keys:
    matches = [p[1] for p in pairs if p[0] == ch]
    if matches:
        print(f"{ch} -> {matches[0]}")
    else:
        print(f"{ch} -> NOT FOUND")
