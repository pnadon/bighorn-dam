// listing vars here so they're in the global scope
console.log('script loaded');

var cards, nCards, cover, openContent, openContentText, pageIsOpen = false,
  openContentImage, closeContent, windowWidth, windowHeight, currentCard;

// initiate the process
init();

function init() {
  resize();
  selectElements();
  attachListeners();
}

// select all the elements in the DOM that are going to be used
function selectElements() {
  cards = document.getElementsByClassName('card');
  nCards = cards.length;
  cover = document.getElementById('cover');
  openContent = document.getElementById('open-content');
  openContentText = document.getElementById('open-content-text');
  openContentImage = document.getElementById('open-content-image');
  closeContent = document.getElementById('close-content');
}

/* Attaching three event listeners here:
  - a click event listener for each card
  - a click event listener to the close button
  - a resize event listener on the window
*/
function attachListeners() {
  for (var i = 0; i < nCards; i++) {
    attachListenerToCard(i);
  }
  closeContent.addEventListener('click', onCloseClick);
  window.addEventListener('resize', resize);
}

function attachListenerToCard(i) {
  cards[i].addEventListener('click', function (e) {
    var card = getCardElement(e.target);
    onCardClick(card, i);
  })
}

/* When a card is clicked */
function onCardClick(card) {
  // set the current card
  currentCard = card;
  // add the 'clicked' class to the card, so it animates out
  currentCard.className += ' clicked';
  // animate the card 'cover' after a 500ms delay
  setTimeout(function () {
    animateCoverUp(currentCard)
  }, 500);
  // animate out the other cards
  animateOtherCards(currentCard, true);
  // add the open class to the page content
  openContent.className += ' open';
}

/*
* This effect is created by taking a separate 'cover' div, placing
* it in the same position as the clicked card, and animating it to
* become the background of the opened 'page'.
* It looks like the card itself is animating in to the background,
* but doing it this way is more performant (because the cover div is
* absolutely positioned and has no children), and there's just less
* having to deal with z-index and other elements in the card
*/
function animateCoverUp(card) {
  // get the position of the clicked card
  var cardPosition = card.getBoundingClientRect();
  // get the style of the clicked card
  var cardStyle = getComputedStyle(card);
  setCoverPosition(cardPosition);
  setCoverColor(cardStyle);
  scaleCoverToFillWindow(cardPosition);
  // update the content of the opened page
  openContentText.innerHTML = '<h1>' + card.children[2].textContent + '</h1>' + paragraphTexts[card.id];
  openContentImage.src = card.children[1].src;
  setTimeout(function () {
    // update the scroll position to 0 (so it is at the top of the 'opened' page)
    window.scroll(0, 0);
    // set page to open
    pageIsOpen = true;
  }, 300);
}

function animateCoverBack(card) {
  var cardPosition = card.getBoundingClientRect();
  // the original card may be in a different position, because of scrolling, so the cover position needs to be reset before scaling back down
  setCoverPosition(cardPosition);
  scaleCoverToFillWindow(cardPosition);
  // animate scale back to the card size and position
  cover.style.transform = 'scaleX(' + 1 + ') scaleY(' + 1 + ') translate3d(' + (0) + 'px, ' + (0) + 'px, 0px)';
  setTimeout(function () {
    // set content back to empty
    openContentText.innerHTML = '';
    openContentImage.src = '';
    // style the cover to 0x0 so it is hidden
    cover.style.width = '0px';
    cover.style.height = '0px';
    pageIsOpen = false;
    // remove the clicked class so the card animates back in
    currentCard.className = currentCard.className.replace(' clicked', '');
  }, 301);
}

function setCoverPosition(cardPosition) {
  // style the cover so it is in exactly the same position as the card
  cover.style.left = cardPosition.left + 'px';
  cover.style.top = cardPosition.top + 'px';
  cover.style.width = cardPosition.width + 'px';
  cover.style.height = cardPosition.height + 'px';
}

function setCoverColor(cardStyle) {
  // style the cover to be the same color as the card
  cover.style.backgroundColor = cardStyle.backgroundColor;
}

function scaleCoverToFillWindow(cardPosition) {
  // calculate the scale and position for the card to fill the page,
  var scaleX = windowWidth / cardPosition.width;
  var scaleY = windowHeight / cardPosition.height;
  var offsetX = (windowWidth / 2 - cardPosition.width / 2 - cardPosition.left) / scaleX;
  var offsetY = (windowHeight / 2 - cardPosition.height / 2 - cardPosition.top) / scaleY;
  // set the transform on the cover - it will animate because of the transition set on it in the CSS
  cover.style.transform =
      'scaleX(' + scaleX + ') ' +
      'scaleY(' + scaleY + ') ' +
      'translate3d(' + (offsetX) + 'px, ' + (offsetY) + 'px, 0px)';
}

/* When the close is clicked */
function onCloseClick() {
  // remove the open class so the page content animates out
  openContent.className = openContent.className.replace(' open', '');
  // animate the cover back to the original position card and size
  animateCoverBack(currentCard);
  // animate in other cards
  animateOtherCards(currentCard, false);
}

function animateOtherCards(card, out) {
  var delay = 100;
  for (var i = 0; i < nCards; i++) {
    // animate cards on a stagger, 1 each 100ms
    if (cards[i] === card) continue;
    if (out) animateOutCard(cards[i], delay);
    else animateInCard(cards[i], delay);
    delay += 100;
  }
}

// animations on individual cards (by adding/removing card names)
function animateOutCard(card, delay) {
  setTimeout(function () {
    card.className += ' out';
  }, delay);
}

function animateInCard(card, delay) {
  setTimeout(function () {
    card.className = card.className.replace(' out', '');
  }, delay);
}

// this function searches up the DOM tree until it reaches the card element that has been clicked
function getCardElement(el) {
  if (el.className.indexOf('card ') > -1) return el;
  else return getCardElement(el.parentElement);
}

// resize function - records the window width and height
function resize() {
  if (pageIsOpen) {
    // update position of cover
    var cardPosition = currentCard.getBoundingClientRect();
    setCoverPosition(cardPosition);
    scaleCoverToFillWindow(cardPosition);
  }
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
}

function toggleMap() {
  var oldmap = document.getElementById("old-map");
  var newmap = document.getElementById("new-map");
  if (oldmap.style.top === "-99999px") {
    oldmap.style.top = "0px";
    newmap.style.top = "-99999px";
  } else {
    oldmap.style.top = "-99999px";
    newmap.style.top = "0px";
  }
}

var paragraphTexts = {
  "kootenay-plains":
    '<p>The Kootenay Plains are characterized by many open forests and grasslands caused by low rainfall and a common occurrence of chinooks. It is also the warmest and driest region of the Rockies. This mild climate is what made this area critical for many animals during the winter, including elk, mule deer, mountain sheep and moose. Currently, over 60 species of birds, 14 mammals, and over 240 species of vascular plants live here. Many of the 240 species of plants are also uncommon in Alberta.</p><p>The Kootenay Plains were previously named Cottonahow Plain, and the Stoney name for this area is Kadoona Tinda, meaning &quot;Windy Plains&quot;. The word Kootenay is an anglicized form of the Kootenay word &quot;Ktunaxa&quot;, which may be a dialectic version of &quot;tunaxa&quot;, which was the name for the Kootenays who inhabited the Kootenay Plains prior to the 19th century. Around 1810, the Peigen people drove the Kootenays out towards the West side of the Rockies using their superior weapons, and in their place the Mountain Cree and Stoneys took their place. These two nations served as middlemen in the fur trade between the Kootenays and the Rocky Mountain trading post.</p><p>When the Bighorn Dam was created it flooded most of the land which the Stoneys still lay claim to, which included cabins, graves, campgrounds, and pastures. The Stoneys asked for compensation, which included reserve land on what remained of the Kootenay Plains. In 1974, the federal government agreed to give them more land but the provincial government refused, and so to this day no Bighorn-Kootenay band member owns any land in the Kootenay Plains. </p><p>Currently, 95% of the people living in the Bighorn Reserve are on welfare since the loss of hunting and the plains from the creation of Abraham Lake made them lose their way of life, and have been unable to transition to a different trade or lifestyle. The Kootenay Plains, which used to represent a &quot;paradise&quot; for wildlife, now has diminished in exchange for the land which Abraham Lake now covers.</p>',
  "abraham-flats":
    '<p>The Abraham Flats are located just outside of the Cline River at its confluence with the North Saskatchewan River. It was previously named Cataract Flats after the Cline River&#39;s previous name, Cataract River. </p><p>The Flats are also where Silas Abraham and his son, Norman, built cabins to live in, and also speculated to have been the place of birth for Silas Abraham in 1871.</p><p>Its current name, Abraham Flats, is one of the many places in the Rockies named after the Abraham family, who were incredibly important to both the Stoneys and the settlers in the area. Because of these contributions, Silas Abraham and his family are almost synonymous with the Kootenay Plains and area. Other areas named after the Abraham family include Mount Abraham, Abraham Lake, and Abraham Slabs. An interesting point to note is that all of these places were named by non-natives, since the First Nations people have a firm belief in not naming places after people. Although these areas were named after the Abrahams to honour them, one must ponder if the current state of these areas caused by the creation of the reservoir, truly represents what the Abrahams stood for. Today, the Abraham Flats are almost always underneath Abraham Lake, and only come into view when the water level is low.</p>',
  "windy-point":
    '<p>&quot;The magnificent view from Windy Point is likely to become even more exciting when looking over the man-made lake at full supply&quot; (Ross, Jane, pg 62). This is quoted from a reporter in 1970 on the recreational potential of the lake.</p><p>Windy Point is a highly valued place to the Stoneys, and the flooding of the Kootenay Plains impacted it in a crucial manner.</p><p>The main problem with the creation of the reservoir was the risk of flooding Stoney graves at Windy Point, which were placed near the water. Many First Nations have a close connection between bodies of water and the dead. When a member passed away, they were buried at the confluence of a body of water and a stream, one of which represented life and the other death. Their spirits would then be carried by both bodies of water into the afterlife. This is why many First Nations have a fear of dying away from water.</p><p>Thus, with the threat of having their gravesite destroyed due to flooding, they were faced with a choice of either leaving the graves, or moving them to a safer location. Some graves ended up being moved but many stayed, and are currently underneath Abraham Lake. Some of these graves contain members of the Abraham family, which the lake is named after.</p><p>Windy Point currently serves as a tourist area, where people who are driving down the Thompson Highway stop to come down and look at Abraham Lake. This is a sharp contrast to what it used to be; a place where families would buries their loved ones, at the junction between the paths of life and death.</p>',
  "abraham-lake":
    '<p>The philosophy of the Stoney tribe is to live in harmony with nature. If you destroy nature or the environment, you are ultimately destroying yourself. This is why at the heart of the differences between First Nations and the settlers, was the differing perspectives on the meaning of land.</p><p>&quot;The sacred waters, the hot springs that we used for healing and cleansing, were to become tourist resorts; our sacred mountains were to become ski areas and parks where we no longer have the right to pursue our religious practice!&quot; (Snow, John, pg 77).</p><p>Currently, Abraham Lake has a length of 32km, a maximum width of 3km, and a surface area of over 80&#39;000 acres, which amounts to over 120 sections of land.</p><p>Although the lake was proposed to be a great place for recreation, in 1970 a survey was carried out which determined that due to its length and shallowness, that it was far too dangerous to swim or sail in, thus ruining its potential for recreation. When the reservoir is low, the lake reveals gravel terraces which make walking along them difficult and hot. The silt and debris in the waters also discourage any swimming.</p><p>However, the lake is gorgeous in the winter, where the methane bubbles from the still-decomposing organisms underneath the lake become frozen in ice, which attracts a lot of tourism.</p><p>The lake was named after a Stoney named Silas Abraham, and his family, who had lived near the north Saskatchewan River for centuries. &quot;The impounded waters form an artificial lake named Powell, supposedly to honor but actually to dishonor the memory, spirit, and vision of Major John Wesley Powell, first American to make a systematic exploration of the Colorado River and its environs. Where he and his brave men once lined the rapids and glided through silent canyons two thousand feet deep the motorboats now smoke and whine, scumming the water with cigarette butts, beer cans and oil, dragging the water skiers on their rounds, clockwise.&quot; (Abbey, Edward, pg 152). This quote from Abbey&#39;s book, although very brusque, does strike a tone of similarity between his description of Lake Powell, and our Abraham Lake. The creation of the bighorn Dam and resulting reservoir of water destroyed many features associated with this family, including Silas Abraham&#39;s birth place at Abraham Flats, where he and his son Norman also created and lived in cabins. The name was given to honour this family and what it stood for, but unfortunately the lake itself also embodies the destruction of lifestyle for the Stoneys in the Kootenay Plains, as well as the nature they lived alongside.</p>',
  "bighorn-dam":
    '<p>In 1969, John Snow, who became chief the same year, had heard rumours of plans to build a dam north of the Kootenay Plains. He assumed it was for a long term project, since the Stoneys still had claims on the area that had not been settled. What he didn&#39;t know is that Calgary Power and the Albertan government had already signed an agreement to begin construction of the dam, without first consulting the First Nations peoples of the area. Calgary Power predicted it could output around 108&#39;000 kW of hydroelectric power, and that the reservoir would provide many recreation opportunities. As we know from the Abraham Lake page, the reservoir ended up being too dangerous for recreation. The Albertan government stated it had given 2 weeks notice to the residents of the construction which would begin soon. However, for John Snow this came as a surprise:</p><p>&quot;Before I discovered how far this had gone, work crews had moved in with heavy equipment and begun massive destruction of the beautiful North Saskatchewan Valley near the Bighorn Reserve. Wesley Band members from the reserve came to Morley Reserve and told [John Snow] of bulldozers knocking over [First Nations] log cabin, destroying [First Nations] graves, and ruining traplines as well as traditional hunting areas.&quot; (Snow, John, pg 128).</p><p>After hearing of this, he went to see for himself and found the land which still had claims on it being bulldozed, including cabins and graves. He then had a meeting with the Wesley Band members, and came to an unanimous agreement to oppose the construction of the dam until the claims were settled. John Snow wrote a letter to Premier Strom, pointing out that the creation of the dam would bring harm to the following:</p><ul><li>Burial sites</li><li>Homes</li><li>Land</li><li>Hunting area</li><li>Grazing land for horses</li><li>Traplines</li><li>Sun Dance and Recreation Area</li><li>Historical / Cultural significance of the land</li><li>Disruption of way of life</li><li>Fear of living below the dam</li></ul><p>Unfortunately, the government &quot;turned a deaf ear&quot;, and the dam was built anyways.</p><p>With our constant need to improve and build upon our land, we often forget that by changing the landscape, we destroy the stories and meanings attached to them. The place-names, stories and meaning contained within the burial sites, hunting grounds, and homes around Windy Point, Abraham Flats, and the Kootenay Plains were exchanged for hydroelectric power, and we must remain aware of that fact.</p>',
  "new-kootenay-plains": '', "new-windy-point": '',
  "credits":
  '<p><strong>About</strong></p><p>This project was developed in order to provide a backstory to the creation and meaning of the Bighorn Dam, and the land that it affected, especially the Kootenay Plains. The project was designed and developed by Philippe Nadon as part of the Winter 2019 AUREL 365 course at the University of Alberta, Augustana Campus.</p><p>The cards within this project are a heavily modified version of <a href="https://s.codepen.io/rachsmith/fullpage/PWxoLN">This pen</a>.</p><p><strong>Bibliography</strong></p><p>Derek Chambers Photography <a href="https://derekchambersphotography.com/travels/around-bc-and-the-yukon/kootenay-plains-and-abraham-lakealberta/">https://derekchambersphotography.com/travels/around-bc-and-the-yukon/kootenay-plains-and-abraham-lakealberta/</a></p><p>Ross, Jane, and Daniel Kyba. <em>The David Thompson Highway: A Hiking Guide</em>. Calgary [Alta.]: Rocky Mountain Books, 1995.</p><p>Snow, John. <em>These Mountains Are Our Sacred Places: The Story of the Stoney Indians</em>. Toronto, ON: S. Stevens, 1977. </p><p>Pettapiece, <em>W. W.. LAND CLASSIFICATION AND SOILS IN THE ROCKY MOUNTAINS OF ALBERTA ALONG THE NORTH SASKATCHEWAN RIVER VALLEY</em>. Alberta Institute of Pedology, 1971.</p><p>Google Maps. <em>Abraham Lake</em>. Accessed Jan 16, 2019.<a href="%20https://goo.gl/maps/jwsMKN8d5bA2"> https://goo.gl/maps/jwsMKN8d5bA2</a></p><p>Abbey, Edward, <em>Desert Solitaire: A Season In the Wilderness. </em></p>'
};

paragraphTexts["new-kootenay-plains"] = paragraphTexts["kootenay-plains"];
paragraphTexts["new-windy-point"] = paragraphTexts["windy-point"];