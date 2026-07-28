import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from check_graph import load_graph

FIX = str(pathlib.Path(__file__).parent / "fixtures" / "parse")

def test_parses_type_id_relations_anchors_links():
    g = load_graph(FIX)
    n = g.nodes["modules/m01/index.md"]
    assert n.type == "module"
    assert n.id == "m01"
    assert {(e.type, e.target_file, e.target_anchor) for e in n.relations} == {
        ("owns", "modules/m01/index.md", "Thing"),
        ("consumes", "modules/m02/data.md", "Other"),
    }
    assert "Thing" in n.anchors            # heading "### Thing" -> anchor "Thing"
    assert ("modules/m02/data.md", "Other") in {(l.target_file, l.target_anchor) for l in n.inline_links}
    assert ("modules/m01/rules.md", "BR-M01-01") in {(l.target_file, l.target_anchor) for l in n.inline_links}
