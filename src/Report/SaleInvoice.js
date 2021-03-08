
import store from '@/store'
import printJS from "print-js";

export function SaleInvoiceA4(temp) {
  let TotalAmmount = (
    temp.InventoryMovements.reduce((prev, cur) => {
      return prev + cur.Qty * cur.SellingPrice;
    }, 0) - temp.Discount
  ).toFixed(store.getters.settings.ToFixed);
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{Vendor.Name}}', temp.Name)
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{PaymentMethod}}', temp.PaymentMethod == 'Cash' ? "ذمم" : "كاش")
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{FakeDate}}', temp.FakeDate)
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{Discount}}', temp.Discount)
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{Tax}}', temp.Tax)
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{Description}}', temp.Description)
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{TotalAmmount}}', TotalAmmount)
  let res = store.getters.CompanyInfo.HeaderReport.slice(store.getters.CompanyInfo.HeaderReport.search('<tr id="forach"'), store.getters.CompanyInfo.HeaderReport.indexOf("</tr>", store.getters.CompanyInfo.HeaderReport.search('<tr id="forach"')) + 5);
  let tabelInventoryMovements = "";
  temp.InventoryMovements.reverse().forEach(element => {
    tabelInventoryMovements += "<tr style='text-align: center;'>"
    tabelInventoryMovements += "<td>" + (element.SellingPrice * element.Qty).toFixed(store.getters.settings.ToFixed) + "</td>";
    tabelInventoryMovements += "<td>" + element.SellingPrice + "</td>";
    tabelInventoryMovements += "<td>" + element.Qty + "</td>";
    tabelInventoryMovements += "<td>" + element.Name + "</td>";
    tabelInventoryMovements += "</tr>"
  });
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace(res, tabelInventoryMovements)
  let win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=600,top=" + (screen.height - 50) + ",left=" + (screen.width - 500));
  win.document.body.innerHTML = store.getters.CompanyInfo.HeaderReport;
  win.print()
}
export function SaleInvoicesList(data) {
  let { Totals, Items } = data
  printJS({
    printable: Items.map(Item => ({
      المجموع: Item.Total.toFixed(store.getters.settings.ToFixed),
      الخصم: Item.Discount,
      "طريقة الدفع ": Item.PaymentMethod,
      التاريخ: Item.FakeDate,
      الحساب: Item.Name,
      الرقم: Item.Id
    })),
    properties: [
      "المجموع",
      "الخصم",
      "طريقة الدفع ",
      "التاريخ",
      "الحساب",
      "الرقم"
    ],
    type: "json",
    header:
      "<center> <h2>" +

      "</h2></center><h3 style='float:right'> الاجمالي النقدي " +
      Totals.Cash.toFixed(store.getters.settings.ToFixed) +
      " - الاجمالي الفيزا : " +
      Totals.Visa.toFixed(store.getters.settings.ToFixed) +
      " - الاجمالي الاجل : " +
      Totals.Receivables.toFixed(store.getters.settings.ToFixed) +
      " - صافي الربح : " +
      Totals.Profit.toFixed(store.getters.settings.ToFixed) +
      " - الاجمالي خصم : " +
      Totals.Discount.toFixed(store.getters.settings.ToFixed) +
      " - الاجمالي التكلفة : " +
      Totals.TotalCost.toFixed(store.getters.settings.ToFixed) +
      " - الاجمالي :  " +
      (Totals.Totals).toFixed(
        store.getters.settings.ToFixed
      ) +
      "</h3><h3 style='float:right'>  التاريخ  : " +
      formatDate(new Date()) +
      "</h3>",
    gridHeaderStyle: "color: red;  border: 2px solid #3971A5;",
    gridStyle: "border: 2px solid #3971A5; text-align: center;"
  });
}
export function formatDate(date) {
  let d = new Date(date),
    day = "" + d.getDate(),
    month = "" + (d.getMonth() + 1),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("/");
}