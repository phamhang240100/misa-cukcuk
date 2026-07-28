import sys

with open("src/components/views/ApplicationsView.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

# 1. Update colgroup (lines 2239-2246, 0-indexed 2238-2245)
new_col_lines = [
    '                                       <colgroup>\n',
    '                                         <col style={{ width: "280px" }} />\n',
    '                                         <col style={{ width: "380px" }} />\n',
    '                                         <col style={{ width: "120px" }} />\n',
    '                                         <col style={{ width: "60px" }} />\n',
    '                                       </colgroup>\n'
]
lines[2238:2246] = new_col_lines

# Re-read or adjust line numbers since we removed 2 lines in colgroup
# Old colgroup had 8 lines (2239..2246), new has 6 lines. Difference is -2 lines.

# 2. Update headers (Col 1 Ảnh, Col 2 Name, Col 3 Ảnh)
# Before replacement, old header lines were 2249..2281 (which are now 2247..2279 due to -2 offset)
# Let's verify line 2247 (1-based 2248) has "{/* Col 1: Ảnh */}"
print("Checking line 2248:", lines[2247])

new_header_lines = [
    '                                            {/* Col 1: Logo + Món ShopeeFood */}\n',
    '                                            <th className="px-3 py-2 border-r border-[#E9EAEB] text-center bg-[#F2F4F7]">\n',
    '                                              <div className="flex flex-col gap-1.5 items-center">\n',
    '                                                <div className="flex items-center justify-center gap-2">\n',
    '                                                  <img src="https://amismisa.misacdn.net/chat/api/file/v1/file/image/5001/misa.jpg?fileID=a1845383-a3df-4382-b09b-1524fa371b2c.png&preview=true&cId=69de03a24a7bbf58f889e11d&tCode=misa&tenantcode=misa" alt="ShopeeFood" className="w-5 h-5 object-contain" />\n',
    '                                                  <span className="font-bold text-[13px] text-[#101828]">Món ShopeeFood</span>\n',
    '                                                </div>\n',
    '                                                <div className="w-full flex border border-[#D5D7DA] rounded bg-white h-7 items-center overflow-hidden font-normal">\n',
    '                                                  <span className="px-2 bg-white text-gray-500 text-[11px] font-bold h-full flex items-center border-r border-[#D5D7DA] select-none">\n',
    '                                                    *\n',
    '                                                  </span>\n',
    '                                                  <input\n',
    '                                                    type="text"\n',
    '                                                    value={wizardFilterName}\n',
    '                                                    onChange={(e) => {\n',
    '                                                      setWizardFilterName(e.target.value);\n',
    '                                                      setWizardFoodPage(1);\n',
    '                                                    }}\n',
    '                                                    className="w-full px-2 py-0 text-xs bg-transparent outline-none h-full border-none text-[#101828]"\n',
    '                                                  />\n',
    '                                                </div>\n',
    '                                              </div>\n',
    '                                            </th>\n'
]

# Old header lines were 2249..2281 (0-indexed 2248..2280), now offset by -2 => 2246..2278
lines[2246:2279] = new_header_lines

# Calculate line offset: old was 33 lines (2249..2281), new is 23 lines. Delta = 23 - 33 = -10 lines.
# Total cumulative offset = -2 + (-10) = -12 lines.

# 3. Update tbody start (Col 1 Ảnh, Col 2 Name, Col 3 Ảnh MISA -> Col 1 Món ShopeeFood, Col 2 Món tương ứng)
# Originally line 2348 (0-indexed 2347). With -12 offset => 2335 (0-indexed 2335)
print("Checking tbody start line:", lines[2335])

new_tbody_lines = [
    '                                                 {/* Col 1: Món ShopeeFood (Ảnh + Tên) */}\n',
    '                                                 <td className="px-3 py-2 border-r border-[#E9EAEB] text-left text-xs font-semibold text-[#101828]">\n',
    '                                                   <div className="flex items-center gap-2">\n',
    '                                                     {!item.fromCukCuk && (\n',
    '                                                       <div className="shrink-0">\n',
    '                                                         {renderItemImage(item.image)}\n',
    '                                                       </div>\n',
    '                                                     )}\n',
    '                                                     <span>{item.fromCukCuk ? "" : item.name}</span>\n',
    '                                                   </div>\n',
    '                                                 </td>\n',
    '\n',
    '                                                 {/* Col 2: Món tương ứng trên MISA CukCuk (Ảnh + Dropdown selector) */}\n',
    '                                                 <td className="px-3 py-2 border-r border-[#E9EAEB] text-left relative overflow-visible">\n',
    '                                                   <div className="flex items-center gap-2 w-full">\n',
    '                                                     <div className="shrink-0">\n',
    '                                                       {renderItemImage(matchedCukCuk?.image || (matchedCukCuk && !item.fromCukCuk ? item.image : undefined))}\n',
    '                                                     </div>\n',
    '                                                     <div className="flex-1 min-w-0">\n'
]

# Old tbody lines were 2348..2366 (0-indexed 2347..2365, 19 lines). With -12 offset: 2335..2353
lines[2335:2354] = new_tbody_lines

# New tbody lines count is 19 lines. So line count stays same for this block. Total offset remains -12 lines.

# 4. Closing divs before </td>
# Originally line 2471-2473 (0-indexed 2470..2472). With -12 offset => 2458..2460.
print("Checking closing line:", lines[2458])

new_closing_lines = [
    '                                                     </div>\n',
    '                                                   )}\n',
    '                                                     </div>\n',
    '                                                   </div>\n',
    '                                                 </td>\n'
]
# Replacing 2458..2461
lines[2458:2461] = new_closing_lines
# Delta: +2 lines. Cumulative offset becomes -10 lines.

# 5. ColSpan in empty state
# Originally line 2514 (0-indexed 2513). With -10 offset => 2503
print("Checking colSpan line:", lines[2503])
lines[2503] = lines[2503].replace('colSpan={6}', 'colSpan={4}')

with open("src/components/views/ApplicationsView.tsx", "w", encoding="utf-8") as f:
    f.writelines(lines)

print("SUCCESSFULLY APPLIED UPDATES TO STEP 2 TABLE!")
