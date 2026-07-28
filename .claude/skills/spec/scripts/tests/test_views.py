import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from gen_views import render_ownership, render_prefixes
from check_graph import load_graph
FIX = str(pathlib.Path(__file__).parent / "fixtures" / "clean")
PREFIX_FIX = str(pathlib.Path(__file__).parent / "fixtures" / "prefix")

def test_ownership_view_lists_owner():
    md = render_ownership(load_graph(FIX))
    assert "Thing" in md and "m01" in md
    assert md.strip().startswith("<!-- GENERATED")   # never hand-edit banner

def test_prefixes_view_lists_owner():
    md = render_prefixes(load_graph(PREFIX_FIX))
    assert "MSG_M07_" in md and "m07" in md
    assert md.strip().startswith("<!-- GENERATED")   # never hand-edit banner
