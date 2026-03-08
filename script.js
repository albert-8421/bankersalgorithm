const MAX_PROCESSES = 50;
const MAX_RESOURCE_VALUE = 50;

let n;
let m = 3; // Minimum 3 resources

function generateTables() {
    n = parseInt(document.getElementById("processes").value);

    if (isNaN(n) || n < 1) {
        n = 1;
        alert("Number of processes must be at least 1. Using 1 process.");
    }

    if (n > MAX_PROCESSES) {
        alert(`Maximum number of processes is ${MAX_PROCESSES}. Using ${MAX_PROCESSES} processes.`);
        n = MAX_PROCESSES;
    }

    document.getElementById("processes").value = n;

    let tablesDiv = document.getElementById("tables");
    tablesDiv.innerHTML = "";

    tablesDiv.innerHTML += createTable("Allocation");
    tablesDiv.innerHTML += createTable("Max");
    tablesDiv.innerHTML += createAvailable();

    document.getElementById("output").innerHTML = "";
}

function createTable(type) {
    let html = `<h3>${type} Matrix</h3><table>`;
    for (let i = 0; i < n; i++) {
        html += "<tr>";
        for (let j = 0; j < m; j++) {
            html += `<td><input type="number" id="${type}_${i}_${j}" min="0" max="${MAX_RESOURCE_VALUE}" value="0"></td>`;
        }
        html += "</tr>";
    }
    html += "</table>";
    return html;
}

function createAvailable() {
    let html = "<h3>Available Resources</h3><table><tr>";
    for (let j = 0; j < m; j++) {
        html += `<td><input type="number" id="Available_${j}" min="0" max="${MAX_RESOURCE_VALUE}" value="0"></td>`;
    }
    html += "</tr></table>";
    return html;
}

function showError(message) {
    document.getElementById("output").innerHTML = `<span class="error">⚠️ ${message}</span>`;
}

function validateMatrices() {
    if (!n || n < 1) {
        return { valid: false, message: "Please generate the tables with a valid number of processes." };
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            const maxVal = parseInt(document.getElementById(`Max_${i}_${j}`).value) || 0;
            const allocVal = parseInt(document.getElementById(`Allocation_${i}_${j}`).value) || 0;

            if (maxVal < 0 || allocVal < 0) {
                return { valid: false, message: "Resource values cannot be negative." };
            }
            if (maxVal > MAX_RESOURCE_VALUE || allocVal > MAX_RESOURCE_VALUE) {
                return { valid: false, message: `Resource values must be ≤ ${MAX_RESOURCE_VALUE}.` };
            }
            if (allocVal > maxVal) {
                return { valid: false, message: `For process P${i}, allocation cannot exceed maximum demand.` };
            }
        }
    }

    for (let j = 0; j < m; j++) {
        const availVal = parseInt(document.getElementById(`Available_${j}`).value) || 0;
        if (availVal < 0) {
            return { valid: false, message: "Available resources cannot be negative." };
        }
        if (availVal > MAX_RESOURCE_VALUE) {
            return { valid: false, message: `Available resources must be ≤ ${MAX_RESOURCE_VALUE}.` };
        }
    }

    return { valid: true };
}

function calculateNeed() {
    const validation = validateMatrices();
    if (!validation.valid) {
        showError(validation.message);
        return;
    }

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
    const validation = validateMatrices();
    if (!validation.valid) {
        showError(validation.message);
        return;
    }

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