"""Собирает data/quotes.js: каждая цитата ищется в исходном тексте, в сайт идёт текст из источника."""
import json, re, sys
import corpus
from candidates import CANDIDATES

OUT = sys.argv[1]
AUTH = {'Михаил Булгаков': 'bulgakov', 'Антон Чехов': 'chekhov', 'Фёдор Достоевский': 'dostoevsky'}
SPEAKER_OVERRIDE = {
    'Я такая деликатная девушка': 'Дуняша',
    'Люди, львы, орлы': 'Нина, пьеса Треплева',
    'Отчего вы всегда ходите': 'Медведенко и Маша',
}
MAKAR, VARYA = 'Макар Девушкин', 'Варенька Доброселова'
LETTERS = {
    'Вчера я был': MAKAR, 'А вот теперь весна': MAKAR, 'Встал я сегодня': MAKAR,
    'Что это какое утро': MAKAR, 'Сравнил я вас': MAKAR, 'Сегодня я тоже': VARYA,
    'Бывало, в длинный': MAKAR, 'Уж эти мне': MAKAR, 'Я была слишком': VARYA,
    'Как мне весело': VARYA, 'Много я вам': MAKAR, 'Вы не больны': MAKAR,
    'Стыдно, голубчик': MAKAR, 'Вас любят': MAKAR, 'Я теперь крою': VARYA,
    'Воспоминания, радостные': VARYA,
}


def tidy_part(t):
    t = t.replace('--', '—')
    t = re.sub(r'\s+[-–]\s+', ' — ', t)
    t = re.sub(r',\s*[-–—]\s*', ', — ', t)
    t = re.sub(r'(\S)[–—]\s', r'\1 — ', t)
    t = re.sub(r'\.\.\.|…', '…', t)
    t = re.sub(r'…\s*…', '…', t)
    t = re.sub(r'"([^"]*)"', r'«\1»', t)
    t = re.sub(r'[“”„]', '"', t)
    t = re.sub(r'"([^"]*)"', r'«\1»', t)
    if t.count('«') != t.count('»') or t.count('"') % 2:
        t = t.replace('"', '')
        t = t.replace('»', '') if t.count('»') > t.count('«') else t.replace('«', '')
    return re.sub(r'\s+', ' ', t).strip()


def pretty(t):
    parts = [tidy_part(p) for p in t.split(corpus.PARTSEP.strip())]
    parts = [re.sub(r'[,;:.…\s]+$', '', p) if i < len(parts) - 1 else p for i, p in enumerate(parts)]
    t = ' (…) '.join(p.strip() for p in parts)
    t = re.sub(r'[,;:\s]+$', '', t)
    if not re.search(r'[.!?…»]$', t):
        t += '…'
    return t[0].upper() + t[1:]


out, seen = [], set()
for c in CANDIDATES:
    a, k, w, sp, mood, q = c[:6]
    r = corpus.find(k, q)
    assert r, 'не найдено: ' + q
    src_path, text = r
    shown = c[6] if len(c) > 6 else pretty(text)
    # показываемый текст обязан совпадать с источником по словам
    assert corpus.norm(shown)[0] == corpus.norm(text)[0], (shown, text)
    if any(p.endswith('.xml') for p in corpus.FILES[k]):
        sp = next((v for key, v in SPEAKER_OVERRIDE.items() if q.startswith(key)), None) or corpus.speaker(k, q) or sp
    sp = {'Любовь Андреевна': 'Раневская'}.get(sp, sp)
    if k == 'bednye':
        sp = next(v for key, v in LETTERS.items() if q.startswith(key))
    key = corpus.norm(shown)[0]
    assert key not in seen, shown
    seen.add(key)
    out.append({'a': AUTH[a], 'w': w, 's': sp, 'm': mood, 't': shown})

with open(OUT, 'w', encoding='utf-8') as f:
    f.write('// Сгенерировано tools/build_quotes.py. Каждая цитата сверена с полным текстом произведения.\n')
    f.write('// a — автор, w — произведение, s — кто говорит/пишет, m — настроение (warm, light, dream, sigh), t — текст.\n')
    f.write('window.QUOTES = ')
    json.dump(out, f, ensure_ascii=False, indent=1)
    f.write(';\n')
from collections import Counter
print(len(out), Counter(x['a'] for x in out), Counter(x['m'] for x in out))
