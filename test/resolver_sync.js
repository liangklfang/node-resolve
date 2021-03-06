var path = require('path');
var test = require('tape');
var resolve = require('../');

test('foo', function (t) {
    var dir = path.join(__dirname, 'resolver');

    t.equal(
        resolve.sync('./foo', { basedir: dir }),
        path.join(dir, 'foo.js')
    );

    t.equal(
        resolve.sync('./foo.js', { basedir: dir }),
        path.join(dir, 'foo.js')
    );

    t.throws(function () {
        resolve.sync('foo', { basedir: dir });
    });

    t.end();
});

test('bar', function (t) {
    var dir = path.join(__dirname, 'resolver');

    t.equal(
        resolve.sync('foo', { basedir: path.join(dir, 'bar') }),
        path.join(dir, 'bar/node_modules/foo/index.js')
    );
    t.end();
});

test('baz', function (t) {
    var dir = path.join(__dirname, 'resolver');

    t.equal(
        resolve.sync('./baz', { basedir: dir }),
        path.join(dir, 'baz/quux.js')
    );
    t.end();
});

test('biz', function (t) {
    var dir = path.join(__dirname, 'resolver/biz/node_modules');
    t.equal(
        resolve.sync('./grux', { basedir: dir }),
        path.join(dir, 'grux/index.js')
    );

    t.equal(
        resolve.sync('tiv', { basedir: path.join(dir, 'grux') }),
        path.join(dir, 'tiv/index.js')
    );

    t.equal(
        resolve.sync('grux', { basedir: path.join(dir, 'tiv') }),
        path.join(dir, 'grux/index.js')
    );
    t.end();
});

test('normalize', function (t) {
    var dir = path.join(__dirname, 'resolver/biz/node_modules/grux');
    t.equal(
        resolve.sync('../grux', { basedir: dir }),
        path.join(dir, 'index.js')
    );
    t.end();
});

test('cup', function (t) {
    var dir = path.join(__dirname, 'resolver');
    t.equal(
        resolve.sync('./cup', {
            basedir: dir,
            extensions: ['.js', '.coffee']
        }),
        path.join(dir, 'cup.coffee')
    );

    t.equal(
        resolve.sync('./cup.coffee', { basedir: dir }),
        path.join(dir, 'cup.coffee')
    );

    t.throws(function () {
        resolve.sync('./cup', {
            basedir: dir,
            extensions: ['.js']
        });
    });

    t.end();
});

test('mug', function (t) {
    var dir = path.join(__dirname, 'resolver');
    t.equal(
        resolve.sync('./mug', { basedir: dir }),
        path.join(dir, 'mug.js')
    );

    t.equal(
        resolve.sync('./mug', {
            basedir: dir,
            extensions: ['.coffee', '.js']
        }),
        path.join(dir, 'mug.coffee')
    );

    t.equal(
        resolve.sync('./mug', {
            basedir: dir,
            extensions: ['.js', '.coffee']
        }),
        path.join(dir, 'mug.js')
    );

    t.end();
});

test('other path', function (t) {
    var resolverDir = path.join(__dirname, 'resolver');
    var dir = path.join(resolverDir, 'bar');
    var otherDir = path.join(resolverDir, 'other_path');

    t.equal(
        resolve.sync('root', {
            basedir: dir,
            paths: [otherDir]
        }),
        path.join(resolverDir, 'other_path/root.js')
    );

    t.equal(
        resolve.sync('lib/other-lib', {
            basedir: dir,
            paths: [otherDir]
        }),
        path.join(resolverDir, 'other_path/lib/other-lib.js')
    );

    t.throws(function () {
        resolve.sync('root', { basedir: dir });
    });

    t.throws(function () {
        resolve.sync('zzz', {
            basedir: dir,
            paths: [otherDir]
        });
    });

    t.end();
});

test('incorrect main', function (t) {
    var resolverDir = path.join(__dirname, 'resolver');
    var dir = path.join(resolverDir, 'incorrect_main');

    t.equal(
        resolve.sync('./incorrect_main', { basedir: resolverDir }),
        path.join(dir, 'index.js')
    );

    t.end();
});

test('#25: node modules with the same name as node stdlib modules', function (t) {
    var resolverDir = path.join(__dirname, 'resolver/punycode');

    t.equal(
        resolve.sync('punycode', { basedir: resolverDir }),
        path.join(resolverDir, 'node_modules/punycode/index.js')
    );

    t.end();
});

var stubStatSync = function stubStatSync(fn) {
    var fs = require('fs');
    var statSync = fs.statSync;
    try {
        fs.statSync = function () {
            throw new EvalError('Unknown Error');
        };
        return fn();
    } finally {
        fs.statSync = statSync;
    }
};

test('#79 - re-throw non ENOENT errors from stat', function (t) {
    var dir = path.join(__dirname, 'resolver');

    stubStatSync(function () {
        t.throws(function () {
            resolve.sync('foo', { basedir: dir });
        }, /Unknown Error/);
    });

    t.end();
});

