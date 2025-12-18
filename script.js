const supabaseUrl = "https://qaekzikyhdynyetseouz.supabase.co";
const supabaseKey = "PASTE_YOUR_ANON_PUBLIC_KEY_HERE";

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

let inventory = [];
let editIndex = -1;

const inventoryEl = document.getElementById("inventory");
const countEl = document.getElementById("count");

async function loadInventory() {
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  inventory = data;
  showInventory();
}

async function addProduct() {
  const name = productName.value.trim();
  const qty = productQty.value === "" ? 0 : Number(productQty.value);
  const price = productPrice.value === "" ? 0 : Number(productPrice.value);

  if (!name) {
    alert("Product name zaroori hai");
    return;
  }

  if (editIndex === -1) {
    await supabase.from("inventory").insert([{ name, qty, price }]);
  } else {
    await supabase
      .from("inventory")
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
    const status =
      item.qty === 0
        ? '<span class="low">Not Updated</span>'
        : item.qty < 5
        ? '<span class="low">Low Stock</span>'
        : '<span class="ok">OK</span>';

    inventoryEl.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.price}</td>
        <td>${status}</td>
        <td>
          <button class="edit" onclick="editProduct(${index})">Edit</button>
          <button class="delete" onclick="deleteProduct(${index})">Delete</button>
        </td>
      </tr>
    `;
  });

  countEl.innerText = inventory.length;
}

function searchProduct() {
  const v = search.value.toLowerCase();
  showInventory(
    inventory.filter(i => i.name.toLowerCase().includes(v))
  );
}

function editProduct(index) {
  const item = inventory[index];
  productName.value = item.name;
  productQty.value = item.qty;
  productPrice.value = item.price;
  editIndex = index;
}

async function deleteProduct(index) {
  await supabase
    .from("inventory")
    .delete()
    .eq("id", inventory[index].id);

  loadInventory();
}

function clearForm() {
  productName.value = "";
  productQty.value = "";
  productPrice.value = "";
}

loadInventory();
