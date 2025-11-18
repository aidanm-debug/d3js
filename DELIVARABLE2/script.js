const imgLabels = [
  "American Trumpet vine","Anthistiriinae","Elm","Yucca","Mexican Honeysuckle","Texas Barberry","Texas Lantana",
  "Texas Mountain Laurel","Velvet Bundleflower","Caesalpinia","Bluegrass","Jazz","Folk","Classical","Funk","Soul",
  "Western","Country","Rock","Electric Guitar","Acoustic Guitar","Banjo","Mandolin","Standing Bass","Bass",
  "Fiddle","Drums","Steel Pedal","Piano","Django Reindhart","Ed Sheren","Billy Falling","Bill Monroe","Charles Mingus",
  "Victor Wooten","Sierra Ferral","Dave Grohl","Willie Nelson","Hampton Hawes","Art Building","Creek","Yes","No"
];

const imgSrcs = [
  "https://i.postimg.cc/W35MZnL5/D3js-ASSETS-04.jpg","https://i.postimg.cc/V6KjtRQD/D3js-ASSETS-01.jpg",
  "https://i.postimg.cc/4ynpQ9sB/D3js-ASSETS-05.jpg","https://i.postimg.cc/gjr3HZm1/D3js-ASSETS-06.jpg",
  "https://i.postimg.cc/Wzt0wkTC/D3js-ASSETS-07.jpg","https://i.postimg.cc/pryKJFR7/D3js-ASSETS-08.jpg",
  "https://i.postimg.cc/zvMKtGGM/D3js-ASSETS-09.jpg","https://i.postimg.cc/7hc0sZLv/D3js-ASSETS-10.jpg",
  "https://i.postimg.cc/G2XkDQwK/D3js-ASSETS-03.jpg","https://i.postimg.cc/RFgctR5G/D3js-ASSETS-02.jpg",
  "https://i.postimg.cc/tJfWS4gg/D3js-ASSETS-14.jpg","https://i.postimg.cc/sx876ggk/D3js-ASSETS-11.jpg",
  "https://i.postimg.cc/cCjw9LJN/D3js-ASSETS-12.jpg","https://i.postimg.cc/j29PgSjS/D3js-ASSETS-15.jpg",
  "https://i.postimg.cc/Zngp75qv/D3js-ASSETS-16.jpg","https://i.postimg.cc/zvMKtGfz/D3js-ASSETS-13.jpg",
  "https://i.postimg.cc/rsbxnwpW/D3js-ASSETS-17.jpg","https://i.postimg.cc/7PQ3YmnB/D3js-ASSETS-18.jpg",
  "https://i.postimg.cc/J7dN4P5v/D3js-ASSETS-19.jpg","https://i.postimg.cc/m2ky40ff/D3js32ASSETS-24.jpg",
  "https://i.postimg.cc/h43LPp0n/D3js-ASSETS-22.jpg","https://i.postimg.cc/kX6xVKj4/D3js-ASSETS-25.jpg",
  "https://i.postimg.cc/qMh8tymz/D3js-ASSETS-26.jpg","https://i.postimg.cc/CLBjZkvV/D3js-ASSETS-23.jpg",
  "https://i.postimg.cc/BZwTQMBR/D3js-ASSETS-21.jpg","https://i.postimg.cc/kX6xVKjR/D3js-ASSETS-27.jpg",
  "https://i.postimg.cc/KvknKB95/D3js-ASSETS-28.jpg","https://i.postimg.cc/gn9Zqt2S/steeloeda-48.jpg",
  "https://i.postimg.cc/7PQ3Ymnp/D3js-ASSETS-20.jpg","https://i.postimg.cc/XY9dL3S2/D3js-ASSETS-33.jpg",
  "https://i.postimg.cc/m2v77kqC/D3js-ASSETS-30.jpg","https://i.postimg.cc/Z56pHZzk/D3js-ASSETS-34.jpg",
  "https://i.postimg.cc/pLKzCxb3/D3js-ASSETS-36.jpg","https://i.postimg.cc/tCKFFJft/D3js-ASSETS-32.jpg",
  "https://i.postimg.cc/8jbqB3bV/D3js32ASSETS-47.jpg","https://i.postimg.cc/W1RTjcFh/D3js32ASSETS-45.jpg",
  "https://i.postimg.cc/qv2yw0Hd/D3js-ASSETS-37.jpg","https://i.postimg.cc/g238sdbG/D3js-ASSETS-38.jpg",
  "https://i.postimg.cc/zX4KrvFD/steeloeda-43.jpg","https://i.postimg.cc/wBHJbP9s/D3js-ASSETS-41.jpg",
  "https://i.postimg.cc/43ZtFMXK/D3js-ASSETS-39.jpg","https://i.postimg.cc/mgxBRWzR/D3js-ASe12SETS-47.jpg",
  "https://i.postimg.cc/g29mdbXG/D3js32ASSETS-42.jpg"
];

d3.csv("PLANTDATA12.csv", d3.autoType).then(d => {
  const root = makeHier(d)
  drawRings(root)
})

function makeHier(d) {
  let stuff = { name: "root", children: [] }
  const g = d3.group(d, x => x.Location, x => x["Favorite Genre"])
  for (let [loc, genres] of g) {
    let locNode = { name: loc, children: [] }
    for (let [genre, rows] of genres) {
      let genNode = {
        name: genre,
        children: rows.map(x => Object.assign({}, x, { value: 1 }))
      }
      locNode.children.push(genNode)
    }
    stuff.children.push(locNode)
  }
  return d3.hierarchy(stuff).sum(x => x.value || 0).sort((a, b) => b.value - a.value)
}

function drawRings(root) {
  let w = 900
  let r = w / 2
  let svg = d3.select("#chart").append("svg")
    .attr("viewBox", [-r, -r, w, w])
    .style("max-width", w + "px")
    .style("font", "10px sans-serif")

  let leaves = root.leaves()
  let rows = leaves.map(n => n.data)
  let ang = d3.scaleBand().domain(rows.map(x => x.name)).range([0, 2 * Math.PI]).padding(0.02)

  let metas = [
    { id: "name", label: "Plant Type", getter: d => d.name },
    { id: "Location", label: "Location", getter: d => d.Location },
    { id: "Favorite Genre", label: "Favorite Genre", getter: d => d["Favorite Genre"] },
    { id: "instrument", label: "Instrument", getter: d => d.instrument },
    { id: "likeability", label: "Likeability", getter: d => d.likeability },
    { id: "Invasive", label: "Invasive", getter: d => d.Invasive },
    { id: "Favorite Artist", label: "Favorite Artist", getter: d => d["Favorite Artist"] }
  ]

  let inner = 80
  let thick = (r - inner) / metas.length
  let color = d3.scaleOrdinal().domain(["Art Building", "Creek"]).range(["#C1272D", "#0071BC"])
  let arc = d3.arc().startAngle(d => d.a0).endAngle(d => d.a1).innerRadius(d => d.r0).outerRadius(d => d.r1)
  let g = svg.append("g")
  let boxes = []

  metas.forEach((meta, ring) => {
    rows.forEach(p => {
      let a0 = ang(p.name)
      let a1 = a0 + ang.bandwidth()
      let r0 = inner + ring * thick
      let r1 = r0 + thick - 2
      boxes.push({ plant: p, metric: meta, value: meta.getter(p), a0, a1, r0, r1 })
    })
  })

  let cells = g.selectAll("path").data(boxes).join("path")
    .attr("d", arc)
    .attr("fill", "white")
    .attr("stroke", d => color(d.plant.Location))
    .attr("stroke-width", 1.5)
    .on("mouseover", function (e, d) {
      d3.select(this).attr("stroke-width", 3)
      let img = document.getElementById("genre-image")
      let val = String(d.value)
      let i = imgLabels.indexOf(val)
      if (i !== -1) {
        img.src = imgSrcs[i]
        img.alt = val + " image"
      } else {
        img.src = ""
        img.alt = ""
      }
    })
    .on("mouseout", function () {
      d3.select(this).attr("stroke-width", 1.5)
    })

  cells.append("title").text(d =>
    `Plant: ${d.plant.name}\nMetric: ${d.metric.label}\nValue: ${d.value}\nLocation: ${d.plant.Location}\nFavorite Genre: ${d.plant["Favorite Genre"]}\nInstrument: ${d.plant.instrument}\nLikeability: ${d.plant.likeability}\nInvasive: ${d.plant.Invasive}\nFavorite Artist: ${d.plant["Favorite Artist"]}`
  )

  g.selectAll("text").data(boxes).join("text")
    .attr("transform", d => {
      let ang = ((d.a0 + d.a1) / 2) * 180 / Math.PI
      let rm = (d.r0 + d.r1) / 2
      return `rotate(${ang - 90}) translate(${rm},0) rotate(${ang < 180 ? 0 : 180})`
    })
    .attr("dy", "0.35em")
    .attr("font-size", 6.1)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 2.5)
    .attr("paint-order", "stroke")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .text(d => d.value)
}
