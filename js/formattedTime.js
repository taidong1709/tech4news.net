/**
 * @param {Date} date Date
 */
function formatDateTimeVN(date = new Date()) {
    let dayofweek;

    switch (date.getDay()) {
        case 1:
            dayofweek = "Thứ hai"; break;
        case 2:
            dayofweek = "Thứ ba"; break;
        case 3:
            dayofweek = "Thứ tư"; break;
        case 4:
            dayofweek = "Thứ năm"; break;
        case 5:
            dayofweek = "Thứ sáu"; break;
        case 6:
            dayofweek = "Thứ bảy"; break;
        case 7:
            dayofweek = "Chủ nhật"; break;
    }



    return `${dayofweek}, ngày ${date.getDate().toString().padStart(2, "0")
        } tháng ${(date.getMonth() + 1).toString().padStart(2, "0")
        } năm ${date.getFullYear().toString().padStart(4, "0")
        } - ${date.getHours().toString().padStart(2, "0")
        }:${date.getMinutes().toString().padStart(2, "0")
        }:${date.getSeconds().toString().padStart(2, "0")
        }`
}

window.addEventListener("load", () => {
    let f = () => document.querySelectorAll("current-time").forEach(e => e.innerHTML = formatDateTimeVN().replace(/ /g, "\xA0"));
    f(); setInterval(f, 100);
});