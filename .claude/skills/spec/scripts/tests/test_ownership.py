import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from check_graph import load_graph, check_ownership
FIX = str(pathlib.Path(__file__).parent / "fixtures" / "ownership")

def test_dup_and_orphan():
    codes = [(f.code, f.message) for f in check_ownership(load_graph(FIX))]
    assert any(c == "OWN_DUP" and "Invoice" in m for c, m in codes)
    assert any(c == "OWN_ORPHAN" and "Letter" in m for c, m in codes)
