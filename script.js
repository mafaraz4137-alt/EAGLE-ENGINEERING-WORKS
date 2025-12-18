const supabaseUrl = "https://qaekzikyhdynyetseouz.supabase.co";
const supabaseKey = "PASTE_YOUR_ANON_KEY_HERE";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let inventory = [];
let editIndex = -1;

const inventoryEl = document.getElementById("inventory");
const countEl = document.getElementById("count");

async function loadInventory() {
  const { data } = await supabase.from("inventory").select("*");
  inventory = data || [];
  showInventory();
}

async function addProduct() {
  let name = productName.value.trim();
  let qty = productQty.value === "" ? 0 : Number(productQty.value);
  let price = productPrice.value === "" ? 0 : Number(productPrice.value);

  if (!name) return alert("Product name required");

  if (editIndex === -1) {
    await supabase.from("inventory").insert([{ name, qty, price }]);
  } else {
    await supabase.from("inventory")
      .update({ name, qty, price })
      .eq("id", inventory[editIndex].id);
    editIndex = -1;
  }

  clearForm();
  loadInventory();
}

function showInventory(list = inventory) {
  inventoryEl.innerHTML = "";
  list.forEach((item, index) => {
    inventoryEl.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.price}</td>
        <td>${item.qty < 5 ? "Low" : "OK"}</td>
        <td>
          <button onclick="editProduct(${index})">Edit</button>
          <button onclick="deleteProduct(${index})">Delete</button>
        </td>
      </tr>`;
  });
  countEl.innerText = inventory.length;
}

function editProduct(index) {
  let item = inventory[index];
  productName.value = item.name;
  productQty.value = item.qty;
  productPrice.value = item.price;
  editIndex = index;
}

async function deleteProduct(index) {
  await supabase.from("inventory").delete().eq("id", inventory[index].id);
  loadInventory();
}

function clearForm() {
  productName.value = "";
  productQty.value = "";
  productPrice.value = "";
}

function searchProduct() {
  let v = search.value.toLowerCase();
  showInventory(inventory.filter(i => i.name.toLowerCase().includes(v)));
}

loadInventory();
