export default function listString(list){
    let listString = '';

    if (!list || list.length === 0){
        return '';
    } else if (list.length === 1){
        return list[0];
    } else {
        list.forEach((item, index) => {
            if (index === list.length - 1){
                listString = listString + item;
            } else {
                listString = listString + item + ', ';
            }
        })
    }
    return listString
}