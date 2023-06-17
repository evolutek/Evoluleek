function trigger_download(filename, url) {
	var element = document.createElement('a');
	element.setAttribute('href', url);
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

function http_request(url, method="GET", headers={}, body=undefined) {
	return new Promise((resolve, reject) => {
		var http = new XMLHttpRequest();
		http.open(method, url, true);
		for (let key in headers) {
			http.setRequestHeader(key, headers[key]);
		}
		http.onreadystatechange = function() {
			if(http.readyState == 4) {
				if (http.status == 200) {
					resolve(http.responseText);
				} else reject(new Error("invalid http response code " + http.status));
			}
		}
		http.onerror = reject;
		http.send(body);
	});
}

function retreive_ais(ais, folders) {
	return new Promise(async (resolve, reject) => {
		let req_data = {};
		let files_names = {};
		let folders_names = {};
		let folders_paths = {};
		
		for (let i = 0; i < folders.length; i++) {
			const folder = folders[i];
			folders_names[folder.id] = {name: folder.name, parent: folder.folder};
		}
		
		for (const key in folders_names) {
			let path = folders_names[key].name;
			let current = folders_names[key].parent;
			while (current > 0) {
				path = folders_names[current].name + "/" + path;
				current = folders_names[current].parent;
			}
			folders_paths[key] = path;
		}
		
		for (let i = 0; i < ais.length; i++) {
			const ai = ais[i];
			req_data[ai.id] = 0;
			files_names[ai.id] = {name: ai.name, folder: ai.folder};
		}
		
		
		const params = 'ais=' + encodeURIComponent(JSON.stringify(req_data));
	
		const text_data = await http_request('https://leekwars.com/api/ai/sync', 'POST', {
			'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}, params);
		
		const data = JSON.parse(text_data);
		
		let files = [];
		for (let i = 0; i < data.length; i++) {
			const file = data[i];
			let file_name = files_names[file.id].name + ".leek";
			if (files_names[file.id].folder > 0)
				file_name = folders_paths[files_names[file.id].folder] + "/" + file_name;
			files.push({name: file_name, content: file.code});
		}
		
		resolve(files);
	});
}

async function create_zip(files) {
	let zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
	for (let i = 0; i < files.length; i++) {
		let file = files[i];
		console.log("Add to zip: " + file.name);
		await zipWriter.add(file.name, new zip.TextReader(file.content));	
	}
	return URL.createObjectURL(await zipWriter.close());
}

async function dyn_import(url) {
	let s = document.createElement("script");
	s.textContent = await http_request(url);
	document.head.appendChild(s);
}

async function download_ais() {
	// Import ZIP utility
	await dyn_import("https://raw.githubusercontent.com/gildas-lormeau/zip.js/master/dist/zip.min.js");
	
	// Retreive list of AIs
	const farmer_script = document.head.getElementsByTagName("script")[2];
	let cloned_script = farmer_script.cloneNode();
	cloned_script.textContent = farmer_script.textContent;
	document.head.appendChild(cloned_script);
	const farmer = __FARMER__;
	cloned_script.remove();
	
	// Retreive AIs code
	const files = await retreive_ais(farmer.farmer.ais, farmer.farmer.folders);
	const zip_file = await create_zip(files);
	trigger_download("LeekWarsAIs.zip", zip_file);
}

await download_ais();
