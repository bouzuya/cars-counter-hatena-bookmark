import cheerio from 'cheerio';
import fetch from 'node-fetch';

interface Counts { [k: string]: number; }

export default function main(): Promise<Counts> {
  const usernameOrUndefined = process.env.HATENA_BOOKMARK_USERNAME;
  const username = typeof usernameOrUndefined === 'undefined'
    ? 'bouzuya'
    : usernameOrUndefined;
  const url = `http://b.hatena.ne.jp/${username}/`;
  return fetch(url)
    .then((response) => {
      const status = response.status;
      if (status !== 200) throw new Error('invalid status code : ' + status);
      return response.text();
    })
    .then((html) => {
      const $ = cheerio.load(html);
      const labelAndCounts = [] as Array<{ label: string; count: string; }>;
      $('#profile-count-navi dl').each((_, e) => {
        const label = $(e).find('dt').text();
        const count = $(e).find('dd').text().replace(/,/g, '');
        labelAndCounts.push({ label, count });
      });

      // tslint:disable:object-literal-key-quotes
      const labelAndKeys: Array<{ key: string; label: string; }> = [
        { label: 'お気に入られ', key: 'Hatena Bookmark Follower' },
        { label: 'お気に入り', key: 'Hatena Bookmark Follow' },
        { label: 'ブックマーク', key: 'Hatena Bookmark' }
      ];
      // tslint:enable

      const counts = labelAndCounts.reduce((a, { label, count }) => {
        const entry = labelAndKeys.find(({ label: l }) => l === label);
        return typeof entry === 'undefined'
          ? a
          : { ...a, [entry.key]: count };
      }, {});

      return counts;
    });
}
