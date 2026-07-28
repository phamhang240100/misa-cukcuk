import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from check_graph import load_graph, check_prefixes, check_ids
FIX = str(pathlib.Path(__file__).parent / "fixtures" / "prefix")

def test_prefix_leak():
    msgs = [f.message for f in check_prefixes(load_graph(FIX)) if f.code == "MSG_LEAK"]
    assert any("MSG_M08_E02" in m for m in msgs)      # leaked into m07
    assert not any("MSG_M07_V01" in m for m in msgs)  # own prefix -> fine

def test_dup_id():
    msgs = [f.message for f in check_ids(load_graph(FIX)) if f.code == "ID_DUP"]
    assert any("BR-M07-01" in m for m in msgs)
