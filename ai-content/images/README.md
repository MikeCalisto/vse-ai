# Ассеты /ai-content

Все файлы вытянуты с оригинала `aisashka.weblium.site/ai-content` (Weblium CDN), пережаты, каждый ≤ 300 KB. Итого ~3.1 MB.

Если нужно что-то заменить — просто положи файл с тем же именем поверх.

| Файл | Что это |
|---|---|
| `hero.jpg` | шапка — за ноутбуком |
| `deco-ai.png` | зелёный 3D-кубик «AI» (шапка ×2, гарантия) |
| `deco-gift.png` | подарок (3 бонуса) |
| `deco-play.png` | кнопка Play (6 уроков) |
| `deco-gear.png` | шестерёнка (бонус №3) |
| `deco-laptop.png` / `deco-laptop-flip.png` | ноутбук в блоке «Авторські застосунки» |
| `num-1..3.png` | 3D-цифры в блоке «У вас вийде» |
| `icon-for-1..5.png` | иконки блока «Цей курс для вас» |
| `logo-gemini.png`, `logo-nanobanana.png`, `logo-chatgpt.png` | логотипы в бонусах |
| `bonus-roles.jpg` | сетка «10 ролей для ChatGPT» |
| `lesson-1,2,6.jpg` | превью уроков (обычные картинки) |
| `lesson-3,4,5.jpg` | постеры YouTube-уроков |
| `alina.jpg` | постер видеоотзыва Аліни |
| `neuro-1..8.jpg` | карусель нейромереж: ChatGPT → Claude → Gemini → Nano Banana → Veo 3 → Grok → Suno → MINIMAX |
| `apps-bg.jpg`, `guarantee-bg.jpg` | фоны тёмных блоков |
| `author.jpg` | Олександр на неоне Ai_Sasha |
| `review-1..11.jpg` | карусель отзывов |

## Видео

Уроки 3–5 и отзыв Аліни — это YouTube (те же ролики, что на оригинале). Грузятся только по клику, до клика — постер + кнопка Play.

| Где | YouTube ID |
|---|---|
| Урок №3 | `qtTvqEtS-es` |
| Урок №4 | `aBfSLpMRzAQ` |
| Урок №5 | `GY-67pDR_j0` |
| Аліна | `hRibNsc4RT4` |

## Если сжимать новые картинки

```bash
sips -s format jpeg -s formatOptions 82 -Z 1400 input.png --out output.jpg
```
