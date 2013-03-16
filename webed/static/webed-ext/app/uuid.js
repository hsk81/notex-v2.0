UUID = function () {

    assert (uuid);
    assert (uuid.v1);
    assert (uuid.v4);

    return {
        time: uuid.v1,
        random: uuid.v4
    }
}();
