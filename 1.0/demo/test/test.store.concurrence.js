/**
 * 单元测试
 *
 * @author luics (鬼道)
 */

KISSY.use('ua, gallery/storage/1.0/index', function(S, UA, Storage) {
    module('gallery/storage/1.0/index');

    var storage = new Storage({
        onload: function() {
            test("set/get 高并发", function() {
                var xd = storage.getConf('xd');
                var ie67 = (UA.ie && UA.ie < 8);
                xd.set('timeout', ie67 ? 6000 : 3000);
                //ie 采用队列处理能保证准确性，性能缺比原生 postMessage 差开近2个数量级

                var n = ie67 ? 200 : 5000;
                for (var i = 0; i < n; ++i) {
                    testCase('kc' + i, i);
                }
            });

            test("remove/clear", function() {
                stop();
                storage.clear({success: function() {
                    expect(0);
                    start();
                }});
            });
        }
    });

    function testCase(k, v, exp) {
        exp = typeof exp === 'undefined' ? v : exp;
        var eq = (typeof exp === 'object' ? deepEqual : equal);

        stop();
        storage.set({k: k, v: v, success: function(data) {
            eq(data, exp);
            storage.get({k: k, success: function(data) {
                eq(data, exp);
                start();
            }});
        }});
    }

});

