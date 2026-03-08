let n;
let m = 3; // Minimum 3 resources

function generateTables() {
    n = parseInt(document.getElementById("processes").value);
    let tablesDiv = document.getElementById("tables");
    tablesDiv.innerHTML = "";

    tablesDiv.innerHTML += createTable("Allocation");
    tablesDiv.innerHTML += createTable("Max");
    tablesDiv.innerHTML += createAvailable();
}

function createTable(type) {
    let html = `<h3>${type} Matrix</h3><table>`;
    for (let i = 0; i < n; i++) {
        html += "<tr>";
        for (let j = 0; j < m; j++) {
            html += `<td><input type="number" id="${type}_${i}_${j}" min="0"></td>`;
        }
        html += "</tr>";
    }
    html += "</table>";
    return html;
}

function createAvailable() {
    let html = "<h3>Available Resources</h3><table><tr>";
    for (let j = 0; j < m; j++) {
        html += `<td><input type="number" id="Available_${j}" min="0"></td>`;
    }
    html += "</tr></table>";
    return html;
}

function calculateNeed() {
    let output = "<h3>Need Matrix</h3><table>";

    for (let i = 0; i < n; i++) {
        output += "<tr>";
        for (let j = 0; j < m; j++) {
            let max = parseInt(document.getElementById(`Max_${i}_${j}`).value) || 0;
            let alloc = parseInt(document.getElementById(`Allocation_${i}_${j}`).value) || 0;
            output += `<td>${max - alloc}</td>`;
        }
        output += "</tr>";
    }
    output += "</table>";

    document.getElementById("output").innerHTML = output;
}

function checkSafe() {
    let alloc = [], max = [], need = [], avail = [];

    for (let i = 0; i < n; i++) {
        alloc[i] = [];
        max[i] = [];
        need[i] = [];
        for (let j = 0; j < m; j++) {
            alloc[i][j] = parseInt(document.getElementById(`Allocation_${i}_${j}`).value) || 0;
            max[i][j] = parseInt(document.getElementById(`Max_${i}_${j}`).value) || 0;
            need[i][j] = max[i][j] - alloc[i][j];
        }
    }

    for (let j = 0; j < m; j++) {
        avail[j] = parseInt(document.getElementById(`Available_${j}`).value) || 0;
    }

    let finish = Array(n).fill(false);
    let safeSeq = [];
    let work = [...avail];

    let count = 0;

    while (count < n) {
        let found = false;
        for (let i = 0; i < n; i++) {
            if (!finish[i]) {
                let possible = true;
                for (let j = 0; j < m; j++) {
                    if (need[i][j] > work[j]) {
                        possible = false;
                        break;
                    }
                }

                if (possible) {
                    for (let j = 0; j < m; j++)
                        work[j] += alloc[i][j];

                    safeSeq.push("P" + i);
                    finish[i] = true;
                    found = true;
                    count++;
                }
            }
        }

        if (!found) break;
    }

    if (count === n) {
        document.getElementById("output").innerHTML =
            "✅ SAFE STATE<br>Safe Sequence: " + safeSeq.join(" → ");
    } else {
        document.getElementById("output").innerHTML =
            "❌ UNSAFE STATE – Deadlock Possible!";
    }
}