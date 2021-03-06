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
      // tslint:disable
      console.log(html);
      const $ = cheerio.load(html);
      const labelAndCounts = [] as Array<{ label: string; count: number; }>;
      $('ul.userprofile-status li').each((_, e) => {
        const label = $(e).find('.userprofile-status-text').text();
        const count = parseInt(
          $(e).find('.userprofile-status-count').text().replace(/,/g, ''),
          10
        );
        if (!isNaN(count))
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
      }, {} as Counts);

      return counts;
    });
}
