const RSS_URL = `https://lilithdev.neocities.org/posts/feed.txt`;

function adaptHTML(string) {
  return string.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
}

fetch(RSS_URL, {cache: "reload"})
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    //console.log(data);
    //console.log(data);
    const items = data.querySelectorAll("item");
    let html = ``;
    items.forEach((el, idx) => {
      //console.log(el + " : " + idx);
      //console.log(el);
      //console.log(el.querySelector("link").innerHTML);
      html += `
        <article>
          <div>
            <img src="https://lilithdev.neocities.org/index/icon_ame.png">
          </div>
          <a href="${el.querySelector("link").innerHTML}" class="article-content">
            <div class="article-username">
              Neet_piano<span class="article-address">@PRESTO2406</spawn>
            </div>
            <div class="article-title">
              ${adaptHTML(el.querySelector("title").innerHTML)}
            </div>
            <div>
              ${adaptHTML(el.querySelector("description").innerHTML)}
            </div>
          </a>
        </article>
        <div class="article-date">
          ${el.querySelector("pubDate").innerHTML}
        </div>
      `;
      if(idx < items.length - 1) {
        html += `<hr>`;
      }
    });
    if(document.getElementById("blog-feed") != null) {
      /*console.log(html);*/
      document.getElementById("blog-feed").insertAdjacentHTML("afterbegin", html);
      adaptEmojis();
    }
  });
