const debug = !(window.wallpaperRequestRandomFileForProperty);
const logs = (() => {
    const arr = [];
    arr.limit = 200;
    return arr;
})()
var lastLog;

const consoleLog = console.log;
const consoleError = console.error;
var unloadedinfo = [];
console.log = (...args) => log('Log', ...args);
console.warn = (...args) => error('Warn', ...args);
console.error = (...args) => error('Error', ...args);

window.onerror = (message, source, lineno, colno, err) =>
error(
    'Uncaught',
    `${err && err.toString()}
Msg: ${message}
Src: ${source}
Ln: ${lineno}
Col ${colno}`, );

window.onunhandledrejection = (event) => error('Rejection', event.reason);

logs.push = (log) => {
    if (lastLog && lastLog.tag === log.tag && lastLog.message === log.message) {
        lastLog.count++;
        return logs.length;
    }
    lastLog = log;

    if (logs.length === logs.limit) {
        logs.shift();
    }
    updateterminal(log)

    return Array.prototype.push.call(logs, log);
};

function updateterminal(log) {
    var terminalhistory = document.getElementById('terminalhistory');
    if (!terminalhistory) {
        unloadedinfo.push(log);
    } else {
        if (unloadedinfo.length != 0) {
            for (const log of unloadedinfo)
                addterminallog(terminalhistory, log);
        }
        addterminallog(terminalhistory, log);
    }
}
function addterminallog(h, log) {
    h.innerHTML += "<p" + ((log.error) ? " style='color:#ff6666'" : "") + ">" + ((log.tag) ? ("[" + log.tag.replace('\n', '') + "]: ") : "") + log.message + "</p>";
}
function log(tag, ...messages) {
    logs.push({
        tag,
        message: messages.map(m => m && m.toString()).join(' '),
        error: false,
        count: 1,
    });

        consoleLog(...messages);
}

function error(tag, ...messages) {
    logs.push({
        tag,
        message: messages.map(m => m && m.toString()).join(' '),
        error: true,
        count: 1,
    });

    consoleError(...messages);
}

function handlecommand() {
    var command = prompt("Input Command:>");
	if(!command||command=="")
		return;
    var terminalhistory = document.getElementById('terminalhistory');
    const log = {
        tag: null,
        message: command,
        error: false,
        count: 1
    }
    addterminallog(terminalhistory, log);
    try {
        var result = eval(command);
        if (result && result != "") {
            const log = {
                tag: null,
                message: result,
                error: false,
                count: 1
            };
            addterminallog(terminalhistory, log);
        }
    } catch (err) {
        console.error(err);
    }
}
