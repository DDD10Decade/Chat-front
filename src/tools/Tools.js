const Tools = {
    //导出文件
    exportJesn(name, data) {
        var blob = new Blob([data]);//创建blob对象
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = name;
        link.click();
    }
}
export default Tools;