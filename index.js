const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
/////////////////// ///////////////////
////FILES

// // Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

// // console.log(textIn);

// // const textOut = `This is what we know about the avocado: ${textIn}.\n Created on ${Date.now()}`;
// // fs.writeFileSync('./txt/output.txt', textOut)

// // console.log('File Writen')

// // Non-blocking, asynchronous wa

// fs.readFile("./txt/start.txt", 'utf-8', (err, data1) => {
//    //console.log(data)
//     if (err) return console.log('Error 💣')

//     fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
// 		// console.log(data2);

//         fs.readFile(`./txt/append.txt`, 'utf-8', (err,data3) => {
//             console.log(data3)

//             fs.writeFile('./txt/final.txt', `${data2}\n ${data3}`,'utf-8', (err) => {
//                 console.log("Your file has been written🎉")
//             } )
//         });
//     });
// });
// console.log("Will read file!")

//////////////////////////////////////
//// SERVER
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");

const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
	// console.log(req.url);
	// console.log(url.parse(req.url, true));

	const { query, pathname } = url.parse(req.url, true);

	// const pathName = req.url;
	// Overview Page
	if (pathname === "/overview" || pathname === "/") {
		// console.log(query);
		res.writeHead(200, {
			"Content-type": "text/html",
		});
		const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join("");
		const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

		// console.log(cardsHtml);
		res.end(output);

		// Product Page
	} else if (pathname === "/product") {
		console.log(query);

		const product = dataObj[query.id];

		res.writeHead(200, {
			"Content-type": "text/html",
		});
		output = replaceTemplate(tempProduct, product);
		res.end(output);

		// API
	} else if (pathname == "/api") {
		res.writeHead(200, {
			"Content-type": "application/json",
		});
		res.end(data);

		// NOT FOUNd
	} else {
		res.writeHead(404, {
			"Content-type": "text/html",
			"my-own-header": "hello-world",
		});
		res.end("<h1> Page Not Found! </h1>");
	}
});

server.listen(8000, "127.0.0.1", () => {
	console.log("Listening to requests on port 8000");
});
