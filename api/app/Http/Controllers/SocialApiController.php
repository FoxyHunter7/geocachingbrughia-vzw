<?php

namespace App\Http\Controllers;

use App\Services\SocialService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SocialApiController
{
    private $_service;

    public function __construct(SocialService $service)
    {
        $this->_service = $service;
    }

    public function all(Request $request, $isAdmin)
    {
        $language = $request->get('lang');
        $search = $request->query('search', '');
        $perPage = $request->query('per_page', 10);
        $sortBy = $request->query('sort_by');
        $sortDirection = $request->query('sort_direction', 'desc');

        return $this->_service->all($language, $perPage, $search, $sortBy, $sortDirection, $isAdmin);
    }

    public function allPublic (Request $request)
    {
        return response()->json($this->all($request, false), Response::HTTP_OK);
    }

    public function allAdmin (Request $request)
    {
        return response()->json($this->all($request, true), Response::HTTP_OK);
    }

    public function add(Request $request)
    {
        $data = $request->all();
        $social = $this->_service->add($data);

        if ($this->_service->hasErrors()) {
            return [
                "errors" => $this->_service->getErrors()
            ];
        }

        return ["data" => $social];
    }

    public function update(Request $request, int $id)
    {
        $data = $request->all();
        $social = $this->_service->update($id, $data);

        if ($this->_service->hasErrors()) {
            return [
                "errors" => $this->_service->getErrors()
            ];
        }

        return ["data" => $social];
    }

    public function delete(int $id)
    {
        $deletedSocial = $this->_service->delete($id);

        if ($this->_service->hasErrors()) {
            return [
                "errors" => $this->_service->getErrors()
            ];
        }

        return ["deleted" => $deletedSocial];
    }
}
