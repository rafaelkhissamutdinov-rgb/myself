"""Загрузка исходных текстов и поиск цитат с нормализацией (регистр, ё/е, пунктуация, пробелы)."""
import re, os, html, glob

ROOT = os.environ.get('QUOTE_SOURCES', os.path.join(os.path.dirname(__file__), 'src'))

FILES = {
    # Булгаков
    'master': ['w2v/books_before/MasterAndMargarita.txt', 'rn/corpus/Bulgakov_Master.txt'],
    'belaya': ['rn/corpus/Bulgakov_BelayaGvardiya.txt'],
    'diavoliada': ['rn/corpus/Bulgakov_Diavoliada.txt'],
    'yaytsa': ['rn/corpus/Bulgakov_RokovyeYaytsa.txt'],
    'teatr': ['rn/corpus/Bulgakov_TeatralnyjRoman.txt'],
    'vrach': ['rn/corpus/Bulgakov_ZapiskiYonogoVracha.txt'],
    'turbiny': ['rusdracor/tei/bulgakov-dni-turbinyh.xml'],
    'beg': ['rusdracor/tei/bulgakov-beg.xml'],
    'ivan': ['rusdracor/tei/bulgakov-ivan-vasilevich.xml'],
    'zoyka': ['rusdracor/tei/bulgakov-zojkina-kvartira.xml'],
    'kabala': ['rusdracor/tei/bulgakov-kabala-svjatosh.xml'],
    'adam': ['rusdracor/tei/bulgakov-adam-i-eva.xml'],
    'poslednie': ['rusdracor/tei/bulgakov-poslednie-dni.xml'],
    'batum': ['rusdracor/tei/bulgakov-batum.xml'],
    # Чехов
    'dama_coll': ['rn/corpus/Chekhov_Dama.txt'],
    'palata': ['w2v/vector-school/PalataNomer6.txt'],
    'chaika': ['rusdracor/tei/chekhov-chaika.xml', 'w2v/vector-school/Chajka.txt'],
    'vanya': ['rusdracor/tei/chekhov-djadja-vanja.xml', 'rn/corpus/Chekhov_Dyadya.txt'],
    'sestry': ['rusdracor/tei/chekhov-tri-sestry.xml', 'w2v/vector-school/TriSestry.txt'],
    'sad': ['rusdracor/tei/chekhov-vishnevyi-sad.xml', 'w2v/vector-school/VishnevyjSad.txt'],
    'ivanov': ['rusdracor/tei/chekhov-ivanov.xml'],
    'leshii': ['rusdracor/tei/chekhov-leshii.xml'],
    'medved': ['rusdracor/tei/chekhov-medved.xml'],
    'predl': ['rusdracor/tei/chekhov-predlozhenie.xml'],
    'svadba': ['rusdracor/tei/chekhov-svadba.xml'],
    'jubilej': ['rusdracor/tei/chekhov-jubilej.xml'],
    'tragik': ['rusdracor/tei/chekhov-tragik-ponevole.xml'],
    'doroga': ['rusdracor/tei/chekhov-na-bolshoi-doroge.xml'],
    'repina': ['rusdracor/tei/chekhov-tatjana-repina.xml'],
    # Достоевский
    'besy': ['rn/corpus/Dostoyevski_Biesy.txt'],
    'idiot': ['rn/corpus/Dostoyevski_Idiot.txt'],
    'bednye': ['rn/corpus/Dostoyevsky_BednyeLyudi.txt'],
    'karamazov': ['rn/corpus/Dostoyevsky_Karamazow%d.txt' % i for i in range(1, 5)],
    'prest': ['rn/corpus/Dostoyevsky_PrestupleniyeINakazaniye.txt', 'w2v/books_before/CrimeAndPunishment.txt'],
}

_cache = {}
PARTSEP = ' \u0001 '  # маркер пропуска между сегментами


def _read(path):
    t = open(os.path.join(ROOT, path), encoding='utf-8', errors='replace').read()
    if path.endswith('.xml'):
        t = t.split('<text', 1)[-1]
        t = re.sub(r'<speaker>.*?</speaker>', ' ', t, flags=re.S)
        t = re.sub(r'<[^>]+>', ' ', t)
        t = html.unescape(t)
    return t


def norm(s):
    """Возвращает (нормализованная строка из букв/цифр, карта индексов в оригинал)."""
    out, idx = [], []
    for i, ch in enumerate(s):
        c = ch.lower().replace('ё', 'е')
        if c.isalnum():
            out.append(c); idx.append(i)
    return ''.join(out), idx


def texts(key):
    if key not in _cache:
        _cache[key] = []
        for p in FILES[key]:
            raw = _read(p)
            n, idx = norm(raw)
            _cache[key].append((p, raw, n, idx))
    return _cache[key]


def find(key, quote, window=1500):
    """Ищет цитату (сегменты через «…» по порядку). Возвращает точный текст из источника или None."""
    segs = [s for s in re.split(r'\s*(?:…|\.\.\.)\s*(?=\S)', quote) if norm(s)[0]]
    nsegs = [norm(s)[0] for s in segs]
    for p, raw, n, idx in texts(key):
        start = 0
        while True:
            pos = n.find(nsegs[0], start)
            if pos < 0:
                break
            spans, ok, cur = [(pos, pos + len(nsegs[0]))], True, pos + len(nsegs[0])
            for ns in nsegs[1:]:
                q = n.find(ns, cur, cur + window)
                if q < 0:
                    ok = False; break
                if q == cur:  # сегменты стоят вплотную — это один кусок текста
                    spans[-1] = (spans[-1][0], q + len(ns))
                else:
                    spans.append((q, q + len(ns)))
                cur = q + len(ns)
            if ok:
                parts = []
                for a, b in spans:
                    oa, ob = idx[a], idx[b - 1] + 1
                    # подтянуть закрывающую пунктуацию
                    while ob < len(raw) and raw[ob] in '.!?…,;:»"\'':
                        ob += 1
                    parts.append(re.sub(r'\s+', ' ', raw[oa:ob]).strip())
                return p, PARTSEP.join(parts)
            start = pos + 1
    return None


def around(key, phrase, width=400, limit=3):
    """Контекст вокруг фразы — для ручной правки цитат."""
    np_ = norm(phrase)[0]
    res = []
    for p, raw, n, idx in texts(key):
        start = 0
        while len(res) < limit:
            pos = n.find(np_, start)
            if pos < 0:
                break
            o = idx[pos]
            res.append((p, re.sub(r'\s+', ' ', raw[max(0, o - width):o + width])))
            start = pos + 1
    return res


def speaker(key, quote):
    """Для пьес (TEI): имя говорящего, в чьей реплике найдена цитата (по первому сегменту)."""
    first = re.split(r'\s*(?:…|\.\.\.)\s*', quote)[0]
    nq = norm(first)[0]
    for p in FILES[key]:
        if not p.endswith('.xml'):
            continue
        raw = open(os.path.join(ROOT, p), encoding='utf-8').read()
        for m in re.finditer(r'<sp\b[^>]*>(.*?)</sp>', raw, flags=re.S):
            body = m.group(1)
            sp = re.search(r'<speaker>(.*?)</speaker>', body, flags=re.S)
            txt = re.sub(r'<speaker>.*?</speaker>', ' ', body, flags=re.S)
            txt = html.unescape(re.sub(r'<[^>]+>', ' ', txt))
            if nq in norm(txt)[0]:
                return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', sp.group(1))).strip(' .') if sp else '?'
    return None


def letter_author(key, quote):
    """Для «Бедных людей»: чья подпись стоит в конце письма с цитатой."""
    for p, raw, n, idx in texts(key):
        pos = n.find(norm(quote)[0])
        if pos < 0:
            continue
        o = idx[pos]
        rest = raw[o:o + 60000]
        m = re.search(r'(Макар Девушкин|Варвара Доброселова|В\.\s*Д\.|Ваша Варвара|Ваш[^\n]{0,60}Макар)', rest)
        return m.group(1) if m else '?'
    return None
